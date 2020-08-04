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
    public class FlaggedWordRepository
    {
        private readonly ApplicationDbContext _context;

        public FlaggedWordRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //returns a list of flagged words to be used to flag posts with concerning content
        public List<FlaggedWord> GetFlaggedWords()
        {
            return  _context.FlaggedWord.ToList();
        }

    }
}