using Microsoft.Data.SqlClient;
using System;

namespace Journly
{
    public static class ReaderUtils
    {
        public static string GetNullableString(SqlDataReader reader, string columnName)
        {
            int ordinal = reader.GetOrdinal(columnName);

            if (reader.IsDBNull(ordinal))
            {
                return null;
            }

            return reader.GetString(ordinal);
        }
    }
}
