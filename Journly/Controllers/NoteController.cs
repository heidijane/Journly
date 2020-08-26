using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Journly.Data;
using Journly.Models;
using Journly.Repositories;
using Microsoft.Extensions.Configuration;
using System;
using System.Security.Claims;
using System.Collections.Generic;

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
            List<Note> notes = _noteRepository.GetByClientId(id);
            return Ok(notes);
        }


        private User GetCurrentUserProfile()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userRepository.GetByFirebaseUserId(firebaseUserId);
        }

    }
}
