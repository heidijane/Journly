using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Journly.Data;
using Journly.Models;
using Journly.Repositories;
using Microsoft.Extensions.Configuration;
using System;
using System.Security.Claims;

namespace Journly.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepository;
        public UserController(ApplicationDbContext context, IConfiguration configuration)
        {
            _userRepository = new UserRepository(context, configuration);
        }

        //get user by firebaseUserId for login auth
        [Authorize]
        [HttpGet("{firebaseUserId}")]
        public IActionResult GetByFirebaseUserId(string firebaseUserId)
        {
            var user = _userRepository.GetByFirebaseUserId(firebaseUserId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        //get all user info including therapist info if they are a counselor/therapist
        [Authorize]
        [HttpGet("data/{id}")]
        public IActionResult GetByUserId(int id)
        {
            var user = _userRepository.GetByUserId(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        //Get just the info related to confirming your therapist before registering as a client
        //Don't want this method to use [Authorize] because this data is needed before registration
        [HttpGet("therapist/{counselorCode}")]
        public IActionResult GetByCounselorCode(string counselorCode)
        {
            var therapist = _userRepository.GetByCounselorCode(counselorCode);
            if (therapist == null)
            {
                return NoContent();
            }
            return Ok(therapist);
        }

        //Add a new user to the db
        //Works for both clients and therapists depending on the user object provided
        [Authorize]
        [HttpPost]
        public IActionResult Register(User user)
        {
            user.CreateDate = DateTime.Now;

            if (user.UserTypeId == 1)
            {
                //register user as a therapist
                user.TherapistInfo.Verified = true;
                user.TherapistInfo.Code = RandomString.Generate();
            } else
            {
                //register user as a client
                user.UserRelationship.StartDate = DateTime.Now;
                user.UserRelationship.EndDate = null;                
            }

            _userRepository.Add(user);

            return CreatedAtAction(
                nameof(GetByFirebaseUserId), new { firebaseUserId = user.FirebaseUserId }, user);
        }

    }
}
