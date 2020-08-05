using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Journly.Data;
using Journly.Models;
using Journly.Repositories;
using Microsoft.Extensions.Configuration;
using System;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;

namespace Journly.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvatarController : ControllerBase
    {
        private readonly AvatarRepository _avatarRepository;
        public AvatarController(ApplicationDbContext context, IConfiguration configuration)
        {
            _avatarRepository = new AvatarRepository(context);
        }

        //returns a list of the default avatars
        [Authorize]
        [HttpGet]
        public IActionResult GetAvatars()
        {
            List<Avatar> avatars = _avatarRepository.GetAvatars();
            Avatar defaultAvatar = avatars.First();
            avatars.RemoveAt(0);
            avatars.Add(defaultAvatar);
            return Ok(avatars);
        }

    }
}
