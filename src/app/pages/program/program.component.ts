import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-program',
  imports: [FormsModule, CommonModule],
  templateUrl: './program.component.html',
  styleUrl: './program.component.css',
})
export class ProgramComponent implements OnInit {
  userRole: string = localStorage.getItem('userRole') || 'user';
  userId: number = 1;
  programs: any[] = [];
  sessions: any[] = [];
  bookings: any[] = [];
  expandedProgramId: number | null = null;
  isCreating: boolean = false;
  isEditing: boolean = false;
  editProgramData: any = {};
  newProgram: any = { title: '', description: '' };
  authToken: string = 'your_bearer_token_here';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPrograms();
    // this.fetchBookings();
  }

  fetchPrograms() {
    this.http.get<any[]>('http://localhost:8000/programs/programs').subscribe(
      (data) => (this.programs = data),
      (error) => console.error('Error fetching programs', error)
    );
  }

  fetchBookings() {
    this.http.get<any[]>('http://127.0.0.1:8000/bookings/bookings/').subscribe(
      (data) => (this.bookings = data),
      (error) => console.error('Error fetching bookings', error)
    );
  }

  async toggleSessions(programId: number) {
    if (this.expandedProgramId === programId) {
      this.expandedProgramId = null;
      return;
    }

    console.log(`Fetching sessions for programId: ${programId}`);

    // Temporarily disable UI updates until we get a response
    const previousProgramId = this.expandedProgramId;
    this.expandedProgramId = null;

    try {
      const data = await firstValueFrom(
        this.http.get<any[]>(
          `http://127.0.0.1:8000/sessions/by-program/${programId}`
        )
      );

      if (data.length > 0) {
        this.sessions = data;
        this.expandedProgramId = programId; // Expand only when data is available
      } else {
        console.log('No sessions found for this program.');
        this.sessions = [];
        this.expandedProgramId = previousProgramId; // Restore previous state to prevent flicker
      }
    } catch (error) {
      console.error('Error fetching sessions', error);
      this.sessions = [];
      this.expandedProgramId = null;
    }
  }

  isSessionBooked(sessionId: number) {
    return this.bookings.some(
      (booking) =>
        booking.session_id === sessionId && booking.user_id === this.userId
    );
  }

  updateSession(sessionId: number, updatedDate: string, programId: number) {
    if (!updatedDate) {
      alert('Please enter a valid session date.');
      return;
    }

    const sessionData = { date: updatedDate, program_id: programId };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });

    this.http
      .put(`http://127.0.0.1:8000/sessions/${sessionId}`, sessionData, {
        headers,
      })
      .subscribe(
        () => {
          alert('Session updated successfully!');
          if (programId) {
            this.toggleSessions(programId); // Ensure valid programId
          }
        },
        (error) => {
          console.error('Error updating session', error);
          if (error.status === 403) {
            alert(
              'You are not allowed to update this session. Only Trainers can update.'
            );
          }
        }
      );
  }

  deleteSession(sessionId: number, programId: number) {
    if (!confirm('Are you sure you want to delete this session?')) return;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    });

    this.http
      .delete(`http://127.0.0.1:8000/sessions/${sessionId}`, { headers })
      .subscribe(
        () => {
          alert('Session deleted successfully!');
          if (programId) {
            this.toggleSessions(programId); // Ensure valid programId
          }
        },
        (error) => console.error('Error deleting session', error)
      );
  }

  bookSession(sessionId: number) {
    if (this.isSessionBooked(sessionId)) {
      alert('You have already booked this session.');
      return;
    }

    const bookingData = { user_id: this.userId, session_id: sessionId };

    this.http
      .post('http://127.0.0.1:8000/bookings/bookings/', bookingData)
      .subscribe(
        (response) => {
          alert('Session booked successfully!');
          this.fetchBookings(); // Refresh bookings
        },
        (error) => console.error('Error booking session', error)
      );
  }

  createProgram() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Retrieve token from local storage
    });

    this.http
      .post('http://127.0.0.1:8000/programs/programs', this.newProgram, {
        headers,
      })
      .subscribe(
        () => {
          this.fetchPrograms();
          this.isCreating = false;
          this.newProgram = { title: '', description: '' };
        },
        (error) => console.error('Error creating program', error)
      );
  }

  editProgram(program: any) {
    this.isEditing = true;
    this.isCreating = false;
    this.editProgramData = { ...program };
  }

  saveProgram() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Retrieve token from local storage
    });
    this.http
      .put(
        `http://127.0.0.1:8000/programs/programs/${this.editProgramData.id}`,
        this.editProgramData,
        {
          headers,
        }
      )
      .subscribe(
        () => {
          this.fetchPrograms();
          this.isEditing = false;
        },
        (error) => {
          console.error('Error saving program', error);
          if (error.status === 403) {
            alert('Only Admins can edit programs.');
          }
        }
      );
  }
  newSession: any = { date: '' };

  createSession(programId: number) {
    if (!this.newSession.date) {
      alert('Please enter a session date.');
      return;
    }

    const sessionData = {
      program_id: programId,
      date: this.newSession.date,
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Retrieve token from local storage
    });
    console.log(sessionData);
    console.log(headers);
    this.http
      .post('http://127.0.0.1:8000/sessions/', sessionData, { headers })
      .subscribe(
        () => {
          alert('Session created successfully!');
          this.newSession.date = ''; // Reset the input field
          this.toggleSessions(programId); // Refresh the session list
        },
        (error) => console.error('Error creating session', error)
      );
  }

  toggleCreateMode() {
    this.isCreating = !this.isCreating;
    this.isEditing = false;
  }
}
