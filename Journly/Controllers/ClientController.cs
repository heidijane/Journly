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
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly ClientRepository _clientRepository;
        private readonly UserRepository _userRepository;
        public ClientController(ApplicationDbContext context, IConfiguration configuration)
        {
            _clientRepository = new ClientRepository(context);
            _userRepository = new UserRepository(context, configuration);
        }

        //returns a list of clients belonging to the current therapist
        [HttpGet("list")]
        public IActionResult GetClients()
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser.UserTypeId != 1)
            {
                return Unauthorized();
            }

            List<UserRelationship> clients = _clientRepository.GetClients(currentUser.Id);
            return Ok(clients);
        }

        //returns a specific client for a therapist
        [HttpGet("{id}")]
        public IActionResult GetClient(int id)
        {
            User currentUser = GetCurrentUserProfile();
            if (currentUser.UserTypeId != 1)
            {
                return Unauthorized();
            }
            //make sure that they are the therapist of this user
            bool isTherapist = _userRepository.IsTherapistForUser(id, currentUser.Id);
            if (!isTherapist)
            {
                return Unauthorized();
            }
            User client = _userRepository.GetByUserId(id);
            return Ok(client);
        }

        private User GetCurrentUserProfile()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userRepository.GetByFirebaseUserId(firebaseUserId);
        }

    }
}
