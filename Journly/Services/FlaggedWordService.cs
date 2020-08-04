using Journly.Data;
using Journly.Models;
using Journly.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Journly.Services
{
    public class FlaggedWordService
    {
        private readonly FlaggedWordRepository _flaggedWordRepository;
        public FlaggedWordService(ApplicationDbContext context)
        {
            _flaggedWordRepository = new FlaggedWordRepository(context);
        }

        //determines if a provided string has flagged words in it or not
        public bool HasFlaggedWord(string content)
        {
            if (content == null)
            {
                return false;
            }
            List<FlaggedWord> words = _flaggedWordRepository.GetFlaggedWords();

            if (words.Any(word => content.ToLower().Contains(word.Word)))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
