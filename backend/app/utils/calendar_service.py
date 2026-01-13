from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import logging

logger = logging.getLogger(__name__)

def create_google_meet_event(access_token: str, refresh_token: str, meeting_details: dict):
    """
    Creates a Google Calendar event with a Google Meet link.
    Requires a valid access_token and refresh_token for the user.
    """
    try:
        # Reconstruct credentials
        creds = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id="YOUR_GOOGLE_CLIENT_ID", # Should come from env in real app
            client_secret="YOUR_GOOGLE_CLIENT_SECRET", # Should come from env in real app
            scopes=['https://www.googleapis.com/auth/calendar.events']
        )

        service = build('calendar', 'v3', credentials=creds)

        event_body = {
            'summary': meeting_details.get('title', 'Investor Meeting'),
            'location': 'Google Meet',
            'description': meeting_details.get('description', 'Scheduled via VentureFlow'),
            'start': {
                'dateTime': meeting_details['start_time'], # ISO format: '2023-01-01T10:00:00'
                'timeZone': 'UTC', # Or passed timezone
            },
            'end': {
                'dateTime': meeting_details['end_time'],
                'timeZone': 'UTC',
            },
            'attendees': [
                {'email': email} for email in meeting_details.get('attendees', [])
            ],
            'conferenceData': {
                'createRequest': {
                    'requestId': f"req-{meeting_details.get('id', '123')}",
                    'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                }
            },
        }

        event = service.events().insert(
            calendarId='primary',
            body=event_body,
            conferenceDataVersion=1
        ).execute()

        return {
            "event_is": event.get('id'),
            "meet_link": event.get('htmlLink'),
            "status": "created"
        }

    except Exception as e:
        logger.error(f"Failed to create Google Calendar event: {e}")
        return None
