using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Journly.Data;
using Journly.Models;
using Journly.Repositories;
using Microsoft.Extensions.Configuration;

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
                return NotFound();
            }
            return Ok(therapist);
        }

        [Authorize]
        [HttpPost]
        public IActionResult Register(User user)
        {
            _userRepository.Add(user);
            return CreatedAtAction(
                nameof(GetByFirebaseUserId), new { firebaseUserId = user.FirebaseUserId }, user);
        }
    }
}
