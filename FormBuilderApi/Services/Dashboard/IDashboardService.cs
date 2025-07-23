using FormBuilderApi.Models;

namespace FormBuilderApi.Services.Dashboard
{
    public interface IDashboardService
    {
        Task<AdminDashboardDto> GetAdminDashboardMetricsAsync();
    }
}