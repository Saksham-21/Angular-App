import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    this.http
      .get<any[]>(
        'http://127.0.0.1:8000/bookings/bookings/'
      )
      .subscribe(
        (data) => (this.bookings = data),
        (error) => console.error('Error fetching bookings', error)
      );
  }

  toggleSessions(programId: number) {
    if (this.expandedProgramId === programId) {
      this.expandedProgramId = null;
      return;
    }
    this.expandedProgramId = programId;
    this.http.get<any[]>(`/api/sessions?program_id=${programId}`).subscribe(
      (data) => (this.sessions = data),
      (error) => console.error('Error fetching sessions', error)
    );
  }

  isSessionBooked(sessionId: number) {
    return this.bookings.some(
      (booking) =>
        booking.session_id === sessionId && booking.user_id === this.userId
    );
  }

  bookSession(sessionId: number) {
    if (this.isSessionBooked(sessionId)) {
      alert('You have already booked this session.');
      return;
    }

    const bookingData = { user_id: this.userId, session_id: sessionId };

    this.http
      .post(
        'http://127.0.0.1:8000/bookings/bookings/',
        bookingData
      )
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

  toggleCreateMode() {
    this.isCreating = !this.isCreating;
    this.isEditing = false;
  }
}
