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
    public class ClientController : ControllerBase
    {
        private readonly ClientRepository _clientRepository;
        private readonly UserRepository _userRepository;
        public ClientController(ApplicationDbContext context, IConfiguration configuration)
        {
            _clientRepository = new ClientRepository(context);
            _userRepository = new UserRepository(context, configuration);
        }

        [Authorize]
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

        private User GetCurrentUserProfile()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userRepository.GetByFirebaseUserId(firebaseUserId);
        }

    }
}
