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
    public class ClientRepository
    {
        private readonly ApplicationDbContext _context;

        public ClientRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //returns a list of user relationships belonging to a certain therapist
        public List<UserRelationship> GetClients(int id)
        {
            return _context.UserRelationship
                .Include(ur => ur.User)
                .Where(ur => ur.TherapistId == id)
                .OrderBy(ur => ur.User.LastName)
                .ToList();
        }

    }
}