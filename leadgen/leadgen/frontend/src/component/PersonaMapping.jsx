// frontend/src/component/PersonaMapping.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Search,
  RotateCcw,
  Save,
  Shield,
  Zap,
  Target,
  BarChart3,
  XCircle,
  Trash2,
} from 'lucide-react';

const DEFAULT_PERSONAS = ['CTO', 'Marketing Manager', 'Sales Director'];

/* ------------------------------- DnD Helpers ------------------------------ */

const CONTAINERS = {
  LIB_PAIN: 'library-painpoints',
  LIB_OUT: 'library-outcomes',
  MAP_PAIN: 'mapped-painpoints',
  MAP_OUT: 'mapped-outcomes',
};

function getContainerType(containerId) {
  if ([CONTAINERS.LIB_PAIN, CONTAINERS.MAP_PAIN].includes(containerId))
    return 'pain_point';
  if ([CONTAINERS.LIB_OUT, CONTAINERS.MAP_OUT].includes(containerId))
    return 'outcome';
  return 'unknown';
}

function isAllowedDrop(activeItem, overContainerId) {
  const targetType = getContainerType(overContainerId);
  return activeItem.type === targetType;
}

function findContainerByItemId(itemsByContainer, itemId) {
  return Object.keys(itemsByContainer).find((cId) =>
    itemsByContainer[cId].some((x) => x.id === itemId)
  );
}

/* --------------------------------- Components -------------------------------- */

function DroppableContainer({ id, title, children, style }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const isMappedContainer = id.includes('mapped');

  return (
    <div
      ref={setNodeRef}
      style={{
        border: isMappedContainer ? '2px dashed #cbd5e1' : 'none',
        borderRadius: 12,
        padding: isMappedContainer ? 16 : 0,
        minHeight: isMappedContainer ? 140 : 20,
        background: isMappedContainer ? '#fff' : 'transparent',
        boxShadow: isOver && isMappedContainer ? '0 0 0 2px #3b82f6' : 'none',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            fontWeight: 700,
            marginBottom: 10,
            fontSize: '14px',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
      {isMappedContainer && React.Children.count(children) === 0 && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
          Drag items here
        </div>
      )}
    </div>
  );
}

function SortableItem({ item, onDelete, onAction }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: '12px',
    marginBottom: 0,
    background: '#fff',
    cursor: 'grab',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  };

  const isPain = item.type === 'pain_point';

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: '800',
              color: isPain ? '#ef4444' : '#15803d',
              background: isPain ? '#fee2e2' : '#dcfce7',
              padding: '2px 6px',
              borderRadius: '999px',
              textTransform: 'uppercase',
            }}
          >
            {isPain ? 'Pain Point' : 'Outcome'}
          </span>
        </div>
        <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>
          {item.title}
        </div>
        {item.description && (
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            {item.description}
          </div>
        )}
      </div>

      {/* Action buttons - we need to stop propagation to prevent drag start */}
      <div style={{ display: 'flex', gap: 4 }} onPointerDown={(e) => e.stopPropagation()}>
        {onAction && (
          <button
            onClick={() => onAction(item.id)}
            style={{
              fontSize: '10px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {item.status === 'mapped' ? 'Unmap' : 'Map'}
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 4,
              cursor: 'pointer',
              color: '#94a3b8'
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

/* --------------------------- Main Component --------------------------- */

const PersonaMapping = ({ icps, selectedIcpId, onSelectIcp }) => {
  const [extraPersonas, setExtraPersonas] = useState([]);
  const personas = useMemo(
    () => [...DEFAULT_PERSONAS, ...extraPersonas],
    [extraPersonas]
  );
  const [activePersona, setActivePersona] = useState(DEFAULT_PERSONAS[0]);

  // We keep 'insights' as the raw data source for ease of fetching/refreshing
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  // DnD State
  const [itemsByContainer, setItemsByContainer] = useState({
    [CONTAINERS.LIB_PAIN]: [],
    [CONTAINERS.LIB_OUT]: [],
    [CONTAINERS.MAP_PAIN]: [],
    [CONTAINERS.MAP_OUT]: [],
  });
  const [activeItemId, setActiveItemId] = useState(null);

  // Sync insights -> itemsByContainer when insights change (e.g. initial load)
  useEffect(() => {
    // Only reset if we just loaded new insights (basic check)
    // In a real app we might want to preserve order if just adding items
    // For now, simple distribution:
    const newItems = {
      [CONTAINERS.LIB_PAIN]: [],
      [CONTAINERS.LIB_OUT]: [],
      [CONTAINERS.MAP_PAIN]: [],
      [CONTAINERS.MAP_OUT]: [],
    };

    insights.forEach(item => {
      if (item.status === 'mapped') {
        if (item.type === 'pain_point') newItems[CONTAINERS.MAP_PAIN].push(item);
        else newItems[CONTAINERS.MAP_OUT].push(item);
      } else {
        if (item.type === 'pain_point') newItems[CONTAINERS.LIB_PAIN].push(item);
        else newItems[CONTAINERS.LIB_OUT].push(item);
      }
    });

    setItemsByContainer(newItems);
  }, [insights]);


  // Custom insight form
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customType, setCustomType] = useState('pain_point');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [savingCustom, setSavingCustom] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved

  // Add persona form
  const [newPersona, setNewPersona] = useState('');

  const currentIcp = useMemo(
    () => icps.find((i) => i.id === selectedIcpId) || null,
    [icps, selectedIcpId]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Load extra personas
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('http://localhost:8003/api/personas');
        if (!res.ok) return;
        const data = await res.json();
        const filtered = data.filter(
          (name) => !DEFAULT_PERSONAS.includes(name)
        );
        setExtraPersonas(filtered);
      } catch (e) {
        console.error('Error fetching personas', e);
      }
    };
    load();
  }, []);

  // Load insights
  useEffect(() => {
    const loadInsights = async () => {
      if (!selectedIcpId || !activePersona) {
        setInsights([]);
        return;
      }

      setLoading(true);
      try {
        let res = await fetch(
          `http://localhost:8003/api/insights/${encodeURIComponent(
            activePersona
          )}?icpId=${selectedIcpId}`
        );
        if (!res.ok) {
          setLoading(false);
          return;
        }

        let data = await res.json();

        if (!data.length) {
          const matchesRes = await fetch(
            `http://localhost:8003/api/leads/${selectedIcpId}/matches`
          );
          if (matchesRes.ok) {
            const reload = await fetch(
              `http://localhost:8003/api/insights/${encodeURIComponent(
                activePersona
              )}?icpId=${selectedIcpId}`
            );
            if (reload.ok) data = await reload.json();
          }
        }

        // Add status if missing
        const processed = data.map((d) => ({
          ...d,
          status: d.status || 'unassigned',
          // Ensure ID is string for dnd-kit if needed, but number is fine usually.
          // Let's keep it as is.
        }));

        setInsights(processed);
      } catch (e) {
        console.error('Error loading insights', e);
      } finally {
        setLoading(false);
      }
    };
    loadInsights();
  }, [selectedIcpId, activePersona]);


  /* ----------------------------- DnD Handlers ----------------------------- */

  const activeItem = useMemo(() => {
    if (!activeItemId) return null;
    const containerId = findContainerByItemId(itemsByContainer, activeItemId);
    return itemsByContainer[containerId]?.find((x) => x.id === activeItemId);
  }, [activeItemId, itemsByContainer]);

  function onDragStart(event) {
    setActiveItemId(event.active.id);
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainerByItemId(itemsByContainer, activeId);
    let overContainer = overId;

    if (!Object.keys(itemsByContainer).includes(overId)) {
      overContainer = findContainerByItemId(itemsByContainer, overId);
    }

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    const draggedItem = itemsByContainer[activeContainer].find(x => x.id === activeId);
    if (!draggedItem || !isAllowedDrop(draggedItem, overContainer)) return;

    setItemsByContainer((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const isOverItem = !Object.keys(prev).includes(overId);
      const overIndex = isOverItem
        ? overItems.findIndex((item) => item.id === overId)
        : overItems.length;

      const [removed] = activeItems.filter((i) => i.id === activeId);
      const updatedItem = { ...removed, status: overContainer.includes('mapped') ? 'mapped' : 'unassigned' };

      return {
        ...prev,
        [activeContainer]: activeItems.filter((item) => item.id !== activeId),
        [overContainer]: [
          ...overItems.slice(0, overIndex),
          updatedItem,
          ...overItems.slice(overIndex),
        ],
      };
    });
  }

  function onDragEnd(event) {
    const { active, over } = event;
    setActiveItemId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainerByItemId(itemsByContainer, activeId);
    let overContainer = overId;

    if (!Object.keys(itemsByContainer).includes(overId)) {
      overContainer = findContainerByItemId(itemsByContainer, overId);
    }

    if (!activeContainer || !overContainer) return;

    if (activeId !== overId) {
      const activeIndex = itemsByContainer[activeContainer].findIndex((i) => i.id === activeId);
      const overIndex = itemsByContainer[overContainer].findIndex((i) => i.id === overId);

      if (activeIndex !== overIndex) {
        setItemsByContainer((items) => ({
          ...items,
          [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
        }));
      }
    }
  }

  /* ------------------------- Manual Actions (Buttons) ------------------------ */

  const handleMap = (id) => {
    // Find item
    const container = findContainerByItemId(itemsByContainer, id);
    if (!container || container.includes('mapped')) return; // Already mapped?

    const item = itemsByContainer[container].find(x => x.id === id);

    const targetContainer = item.type === 'pain_point' ? CONTAINERS.MAP_PAIN : CONTAINERS.MAP_OUT;

    setItemsByContainer(prev => {
      const fromItems = prev[container].filter(x => x.id !== id);
      const toItems = [...prev[targetContainer], { ...item, status: 'mapped' }];
      return { ...prev, [container]: fromItems, [targetContainer]: toItems };
    });
  };

  const handleUnmap = (id) => {
    const container = findContainerByItemId(itemsByContainer, id);
    if (!container || !container.includes('mapped')) return;

    const item = itemsByContainer[container].find(x => x.id === id);
    const targetContainer = item.type === 'pain_point' ? CONTAINERS.LIB_PAIN : CONTAINERS.LIB_OUT;

    setItemsByContainer(prev => {
      const fromItems = prev[container].filter(x => x.id !== id);
      const toItems = [...prev[targetContainer], { ...item, status: 'unassigned' }];
      return { ...prev, [container]: fromItems, [targetContainer]: toItems };
    });
  };

  const handleDeleteInsight = async (id) => {
    if (!window.confirm('Delete this insight?')) return;

    // Optimistic update
    setItemsByContainer(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        next[key] = next[key].filter(x => x.id !== id);
      });
      return next;
    });

    // API call (optional)
    try {
      await fetch(`http://localhost:8003/api/insights/${id}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
  };

  /* --------------------------- Save / Reset --------------------------- */

  const handleSaveMapping = async () => {
    // Reconstruct insights array from itemsByContainer
    const allItems = [
      ...itemsByContainer[CONTAINERS.LIB_PAIN],
      ...itemsByContainer[CONTAINERS.LIB_OUT],
      ...itemsByContainer[CONTAINERS.MAP_PAIN],
      ...itemsByContainer[CONTAINERS.MAP_OUT],
    ];

    setSaveStatus('saving');
    try {
      const res = await fetch('http://localhost:8003/api/insights/save-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insights: allItems })
      });
      if (res.ok) setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error('Save failed', e);
      setSaveStatus('idle');
    }
  };

  const handleResetLocal = () => {
    // Move all mapped to library
    setItemsByContainer(prev => {
      const resetPain = [...prev[CONTAINERS.LIB_PAIN], ...prev[CONTAINERS.MAP_PAIN].map(i => ({ ...i, status: 'unassigned' }))];
      const resetOut = [...prev[CONTAINERS.LIB_OUT], ...prev[CONTAINERS.MAP_OUT].map(i => ({ ...i, status: 'unassigned' }))];

      return {
        [CONTAINERS.LIB_PAIN]: resetPain,
        [CONTAINERS.LIB_OUT]: resetOut,
        [CONTAINERS.MAP_PAIN]: [],
        [CONTAINERS.MAP_OUT]: []
      };
    });
  };

  const handleAddPersona = async () => {
    if (!newPersona.trim()) return;
    if (personas.includes(newPersona)) { setActivePersona(newPersona); return; }

    setExtraPersonas(p => [...p, newPersona]);
    setActivePersona(newPersona);
    setNewPersona('');

    // Save to backend
    await fetch('http://localhost:8003/api/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newPersona })
    });
  };

  const handleDeletePersona = async (p, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete persona "${p}"?`)) return;
    setExtraPersonas(prev => prev.filter(x => x !== p));
    if (activePersona === p) setActivePersona(DEFAULT_PERSONAS[0]);

    // Backend call
    // await fetch(...) 
  };

  const handleAddCustomInsight = async () => {
    if (!customTitle) return;
    setSavingCustom(true);
    try {
      const res = await fetch('http://localhost:8003/api/insights/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          icpId: selectedIcpId,
          persona: activePersona,
          title: customTitle,
          description: customDescription,
          type: customType
        })
      });
      const newItem = await res.json();
      newItem.status = 'unassigned';

      // Add to correct container
      const cId = newItem.type === 'pain_point' ? CONTAINERS.LIB_PAIN : CONTAINERS.LIB_OUT;
      setItemsByContainer(prev => ({
        ...prev,
        [cId]: [newItem, ...prev[cId]]
      }));

      setShowCustomForm(false);
      setCustomTitle('');
      setCustomDescription('');
    } catch (e) { console.error(e); }
    setSavingCustom(false);
  };

  const handleAddAll = () => {
    // Move all from Lib -> Map
    setItemsByContainer(prev => {
      const newMapPain = [...prev[CONTAINERS.MAP_PAIN], ...prev[CONTAINERS.LIB_PAIN].map(i => ({ ...i, status: 'mapped' }))];
      const newMapOut = [...prev[CONTAINERS.MAP_OUT], ...prev[CONTAINERS.LIB_OUT].map(i => ({ ...i, status: 'mapped' }))];

      return {
        [CONTAINERS.LIB_PAIN]: [],
        [CONTAINERS.LIB_OUT]: [],
        [CONTAINERS.MAP_PAIN]: newMapPain,
        [CONTAINERS.MAP_OUT]: newMapOut
      };
    });
  };

  /* ------------------------------- Metrics ------------------------------ */

  const mappedCount = itemsByContainer[CONTAINERS.MAP_PAIN].length + itemsByContainer[CONTAINERS.MAP_OUT].length;
  const totalCount = Object.values(itemsByContainer).flat().length;
  const completeness = totalCount ? Math.round((mappedCount / totalCount) * 100) : 0;


  /* -------------------------------- Render -------------------------------- */

  const painPoints = itemsByContainer[CONTAINERS.MAP_PAIN]; // for summary
  let summaryText = 'No insights yet.';
  if (itemsByContainer[CONTAINERS.LIB_PAIN].length || itemsByContainer[CONTAINERS.MAP_PAIN].length) {
    summaryText = `Found ${itemsByContainer[CONTAINERS.LIB_PAIN].length + itemsByContainer[CONTAINERS.MAP_PAIN].length} pain points and ${itemsByContainer[CONTAINERS.LIB_OUT].length + itemsByContainer[CONTAINERS.MAP_OUT].length} outcomes for ${activePersona}.`;
  }

  return (
    <div style={{ padding: 32, height: '100%', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
      {/* Header & ICP Selection (Simplified for brevity, similar to before) */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Persona Mapping</h1>
          <p style={{ color: '#64748b' }}>Drag insights from the Library to the Mapped area.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleResetLocal} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={handleSaveMapping} disabled={saveStatus === 'saving'} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: saveStatus === 'saved' ? '#16a34a' : '#0f766e', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Save size={16} /> {saveStatus === 'saved' ? 'Saved!' : 'Save Mapping'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', gap: 20 }}>
        {/* ICP SELECT */}
        <div style={{ minWidth: 260 }}>
          <select value={selectedIcpId || ''} onChange={(e) => onSelectIcp(Number(e.target.value))} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }}>
            <option value="">Select ICP...</option>
            {icps.map(icp => <option key={icp.id} value={icp.id}>{icp.profile_name}</option>)}
          </select>
        </div>
        {/* PERSONA TABS */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
          {personas.map(p => (
            <button
              key={p}
              onClick={() => setActivePersona(p)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: 'none',
                background: activePersona === p ? '#2563eb' : '#e2e8f0',
                color: activePersona === p ? '#fff' : '#475569',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {p}
            </button>
          ))}
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: 20, padding: 2 }}>
            <input
              value={newPersona}
              onChange={e => setNewPersona(e.target.value)}
              placeholder="New..."
              style={{ background: 'transparent', border: 'none', padding: '0 8px', outline: 'none', width: 80, fontSize: 13 }}
            />
            <button onClick={handleAddPersona} style={{ border: 'none', background: '#1e293b', color: '#fff', borderRadius: 16, width: 24, height: 24, cursor: 'pointer' }}>+</button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 24, background: '#e2e8f0', height: 6, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${completeness}%`, background: '#22c55e', height: '100%', transition: 'width 0.3s' }} />
      </div>

      {loading && <div style={{ marginBottom: 20, color: '#64748b' }}>Loading insights...</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 32 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={handleDragOver}
          onDragEnd={onDragEnd}
        >
          {/* LEFT COLUMN: LIBRARY */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Library</h3>
              <button onClick={handleAddAll} style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>drag and drop</button>
            </div>

            {/* Custom Insight Button */}
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => setShowCustomForm(!showCustomForm)} style={{ width: '100%', padding: 8, border: '1px dashed #cbd5e1', background: '#f8fafc', borderRadius: 8, color: '#64748b', fontSize: 13, cursor: 'pointer' }}>
                + Add Custom Insight
              </button>
              {showCustomForm && (
                <div style={{ marginTop: 10, padding: 10, background: '#f8fafc', borderRadius: 8 }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <button onClick={() => setCustomType('pain_point')} style={{ flex: 1, padding: 4, borderRadius: 4, border: 'none', background: customType === 'pain_point' ? '#fee2e2' : '#fff', color: customType === 'pain_point' ? '#ef4444' : '#64748b', fontSize: 12, cursor: 'pointer' }}>Pain Point</button>
                    <button onClick={() => setCustomType('outcome')} style={{ flex: 1, padding: 4, borderRadius: 4, border: 'none', background: customType === 'outcome' ? '#dcfce7' : '#fff', color: customType === 'outcome' ? '#15803d' : '#64748b', fontSize: 12, cursor: 'pointer' }}>Outcome</button>
                  </div>
                  <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Title" style={{ width: '100%', padding: 6, marginBottom: 6, borderRadius: 4, border: '1px solid #cbd5e1' }} />
                  <textarea value={customDescription} onChange={e => setCustomDescription(e.target.value)} placeholder="Description" style={{ width: '100%', padding: 6, marginBottom: 6, borderRadius: 4, border: '1px solid #cbd5e1' }} />
                  <button onClick={handleAddCustomInsight} disabled={savingCustom} style={{ width: '100%', padding: 6, background: '#0f172a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Add</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <DroppableContainer id={CONTAINERS.LIB_PAIN} title="Pain Points">
                <SortableContext items={itemsByContainer[CONTAINERS.LIB_PAIN].map(x => x.id)} strategy={verticalListSortingStrategy}>
                  {itemsByContainer[CONTAINERS.LIB_PAIN].map(item => <SortableItem key={item.id} item={item} onAction={handleMap} onDelete={handleDeleteInsight} />)}
                </SortableContext>
              </DroppableContainer>

              <DroppableContainer id={CONTAINERS.LIB_OUT} title="Desired Outcomes">
                <SortableContext items={itemsByContainer[CONTAINERS.LIB_OUT].map(x => x.id)} strategy={verticalListSortingStrategy}>
                  {itemsByContainer[CONTAINERS.LIB_OUT].map(item => <SortableItem key={item.id} item={item} onAction={handleMap} onDelete={handleDeleteInsight} />)}
                </SortableContext>
              </DroppableContainer>
            </div>
          </div>

          {/* RIGHT COLUMN: MAPPED */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800 }}>{activePersona}</h2>
              <p style={{ color: '#64748b' }}>{summaryText}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <DroppableContainer id={CONTAINERS.MAP_PAIN} title={`Mapped Pain Points (${itemsByContainer[CONTAINERS.MAP_PAIN].length})`} style={{ height: '100%' }}>
                <div style={{ background: '#fff', padding: 16, borderRadius: 16, border: '2px dashed #e2e8f0', minHeight: 300 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ padding: 6, background: '#fee2e2', borderRadius: 6, color: '#ef4444' }}><Shield size={18} /></div>
                    <h4 style={{ fontWeight: 700 }}>Pain Points</h4>
                  </div>
                  <SortableContext items={itemsByContainer[CONTAINERS.MAP_PAIN].map(x => x.id)} strategy={verticalListSortingStrategy}>
                    {itemsByContainer[CONTAINERS.MAP_PAIN].map(item => <SortableItem key={item.id} item={item} onAction={handleUnmap} onDelete={handleDeleteInsight} />)}
                  </SortableContext>
                </div>
              </DroppableContainer>

              <DroppableContainer id={CONTAINERS.MAP_OUT} title={`Mapped Outcomes (${itemsByContainer[CONTAINERS.MAP_OUT].length})`} style={{ height: '100%' }}>
                <div style={{ background: '#fff', padding: 16, borderRadius: 16, border: '2px dashed #e2e8f0', minHeight: 300 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ padding: 6, background: '#dcfce7', borderRadius: 6, color: '#15803d' }}><BarChart3 size={18} /></div>
                    <h4 style={{ fontWeight: 700 }}>Desired Outcomes</h4>
                  </div>
                  <SortableContext items={itemsByContainer[CONTAINERS.MAP_OUT].map(x => x.id)} strategy={verticalListSortingStrategy}>
                    {itemsByContainer[CONTAINERS.MAP_OUT].map(item => <SortableItem key={item.id} item={item} onAction={handleUnmap} onDelete={handleDeleteInsight} />)}
                  </SortableContext>
                </div>
              </DroppableContainer>
            </div>
          </div>

          <DragOverlay>
            {activeItem ? <SortableItem item={activeItem} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default PersonaMapping;