<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TimeAttendanceNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $status_message;

    /**
     * Create a new message instance.
     */
    public function __construct($response)
    {
        $this->data = $response['data'] ?? [];
        $this->status_message = $response['message'] ?? '';
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Attendance Notification'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.timeattendance',
            with: [
                'data' => $this->data,
                'status_message' => $this->status_message
            ]
        );
    }
}