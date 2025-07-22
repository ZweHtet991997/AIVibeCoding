using Microsoft.EntityFrameworkCore;

namespace FormBuilderApi.Entities
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<UserTable> UserTable { get; set; }
        public DbSet<FormTable> FormTable { get; set; }
        public DbSet<FormAssignment> FormAssignment { get; set; }
        public DbSet<FormResponse> FormResponse { get; set; }
        public DbSet<FormResponseApproval> FormResponseApproval { get; set; }
    }
}
