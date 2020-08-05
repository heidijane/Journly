using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Journly.Data;
using Journly.Models;
using Microsoft.AspNetCore.JsonPatch.Internal;
using System;
using Microsoft.EntityFrameworkCore.Internal;

namespace Journly.Repositories
{
    public class AvatarRepository
    {
        private readonly ApplicationDbContext _context;

        public AvatarRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //returns a list of default avatars
        public List<Avatar> GetAvatars()
        {
            return _context.Avatar.OrderBy(a => a.Id).ToList();

        }
    }
}