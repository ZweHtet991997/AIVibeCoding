namespace FormBuilderApi.Services
{
    public static class DateConvertService
    {
        public static DateTime GetCurrentMyanmarDateTime()
        {
            var myanmarTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Myanmar Standard Time");
            var myanmarDateTime = TimeZoneInfo.ConvertTime(
                DateTime.Now,
                TimeZoneInfo.Local,
                myanmarTimeZone
            );

            return myanmarDateTime;
        }
    }
}
