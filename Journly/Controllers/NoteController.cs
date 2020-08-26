using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Journly.Data;
using Journly.Models;
using Journly.Repositories;
using Microsoft.Extensions.Configuration;
using System;
using System.Security.Claims;
using System.Collections.Generic;
using Ganss.XSS;

namespace Journly.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NoteController : ControllerBase
    {
        private readonly NoteRepository _noteRepository;
        private readonly UserRepository _userRepository;
        public NoteController(ApplicationDbContext context, IConfiguration configuration)
        {
            _noteRepository = new NoteRepository(context);
            _userRepository = new UserRepository(context, configuration);
        }

        //gets note by ID
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var note = _noteRepository.GetById(id);
            if (note == null)
            {
                return NotFound();
            }
            //check to make sure that current user is the author of this note
            User currentUser = GetCurrentUserProfile();
            if (currentUser.Id != note.TherapistId)
            {
                return Unauthorized();
            }

            return Ok(note);
        }

        //gets all current therapist's notes
        [HttpGet("all")]
        public IActionResult GetAllNotes()
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            List<Note> notes = _noteRepository.GetByTherapistId(currentUser.Id);
            return Ok(notes);
        }

        //gets all notes by a specific client
        [HttpGet("user/{id}")]
        public IActionResult GetNotesByClientId(int id)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }
            //make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(id, currentUser.Id);
            if (currentUser.UserTypeId == 1 && !isTherapist)
            {
                return Unauthorized();
            }
            List<Note> notes = _noteRepository.GetByClientId(currentUser.Id, id);
            return Ok(notes);
        }

        //add a new note
        [HttpPost]
        public IActionResult Post(Note note)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser == null)
            {
                return Unauthorized();
            }

            //make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(note.ClientId, currentUser.Id);
            if (currentUser.UserTypeId == 1 && !isTherapist)
            {
                return Unauthorized();
            }

            note.TherapistId = currentUser.Id;
            note.CreateDate = DateTime.Now;

            //sanitize the html
            var sanitizer = new HtmlSanitizer();
            note.Content = sanitizer.Sanitize(note.Content);

            _noteRepository.Add(note);
            return CreatedAtAction(nameof(Get), new { id = note.Id }, note);
        }

        //edits a note in the db
        [HttpPut]
        public IActionResult Edit(Note newNote)
        {
            Note note = _noteRepository.GetById(newNote.Id);
            if (note == null)
            {
                return NotFound();
            }
            //check to make sure that the user is authorized to edit the post
            User currentUser = GetCurrentUserProfile();
            if (currentUser.Id != note.TherapistId)
            {
                return Unauthorized();
            }

            //make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(newNote.ClientId, currentUser.Id);
            if (currentUser.UserTypeId == 1 && !isTherapist)
            {
                return Unauthorized();
            }

            //sanitize the html
            var sanitizer = new HtmlSanitizer();
            note.Content = sanitizer.Sanitize(newNote.Content);
            note.ClientId = newNote.ClientId;

            _noteRepository.Update(note);
            return CreatedAtAction(nameof(Get), new { id = note.Id }, note);
        }

        //soft-deletes a note
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Note note = _noteRepository.GetById(id);
            if (note == null)
            {
                return NotFound();
            }
            //check to make sure that the user is authorized to delete the post
            User currentUser = GetCurrentUserProfile();
            if (currentUser.Id != note.TherapistId)
            {
                return Unauthorized();
            }
            //update the note object to deleted status
            note.Deleted = true;
            _noteRepository.Update(note);
            return NoContent();
        }

        private User GetCurrentUserProfile()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userRepository.GetByFirebaseUserId(firebaseUserId);
        }

    }
}
