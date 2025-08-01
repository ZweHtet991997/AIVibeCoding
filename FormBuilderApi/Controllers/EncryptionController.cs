using FormBuilderApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilderApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EncryptionController : ControllerBase
    {
        private readonly IAesEncryptionService _encryptionService;

        public EncryptionController(IAesEncryptionService encryptionService)
        {
            _encryptionService = encryptionService;
        }

        public class EncryptRequest
        {
            public string PlainText { get; set; } = string.Empty;
        }

        public class EncryptResponse
        {
            public string CipherText { get; set; } = string.Empty;
        }

        public class DecryptRequest
        {
            public string CipherText { get; set; } = string.Empty;
        }

        public class DecryptResponse
        {
            public string PlainText { get; set; } = string.Empty;
        }

        [HttpPost("encrypt")]
        public ActionResult<EncryptResponse> Encrypt([FromBody] EncryptRequest request)
        {
            var cipherText = _encryptionService.Encrypt(request.PlainText);
            return Ok(new EncryptResponse { CipherText = cipherText });
        }

        [HttpPost("decrypt")]
        public ActionResult<DecryptResponse> Decrypt([FromBody] DecryptRequest request)
        {
            var plainText = _encryptionService.Decrypt(request.CipherText);
            return Ok(new DecryptResponse { PlainText = plainText });
        }
    }
}