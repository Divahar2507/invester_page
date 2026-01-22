import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Video, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function MeetingScheduler({ startupId, startupName, pitchId }) {
    const [formData, setFormData] = useState({
        title: `Meeting with ${startupName}`,
        description: "",
        date: "",
        time: "",
        duration: 30,
        type: "virtual" // virtual or physical
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent scheduling for dummy/demo data
        if (startupId && startupId.toString().startsWith('d')) {
            alert("This is a demo startup. Logic meeting scheduling is disabled in demo mode.");
            return;
        }

        setSubmitting(true);

        try {
            // Combine date and time
            const meetingTime = new Date(`${formData.date}T${formData.time}`);

            await api.scheduleMeeting({
                startup_id: startupId,
                pitch_id: pitchId,
                title: formData.title,
                description: formData.description,
                meeting_time: meetingTime.toISOString(),
                duration_minutes: Number(formData.duration),
                meet_link: formData.type === 'virtual' ? "https://meet.google.com/new" : null
            });

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setFormData(prev => ({ ...prev, description: "", date: "", time: "" }));
            }, 3000);

        } catch (error) {
            console.error('Error scheduling meeting:', error);
            alert('Failed to schedule meeting');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Meeting Scheduled!</h3>
                <p className="text-green-600 mb-4">
                    Invitation sent to {startupName}.
                </p>
                <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(formData.title)}&details=${encodeURIComponent(formData.description)}&dates=${new Date(`${formData.date}T${formData.time}`).toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(new Date(`${formData.date}T${formData.time}`).getTime() + formData.duration * 60000).toISOString().replace(/-|:|\.\d\d\d/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                    <Calendar size={16} />
                    Add to Google Calendar
                </a>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="text-blue-600" />
                Schedule a Meeting
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <select
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="virtual">Virtual (Google Meet)</option>
                            <option value="physical">In Person</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Agenda or key topics to discuss..."
                    ></textarea>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Calendar size={18} />
                                Confirm Schedule
                            </>
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-2">
                        Both parties will receive a Google Calendar invitation.
                    </p>
                </div>
            </form>
        </div>
    );
}
