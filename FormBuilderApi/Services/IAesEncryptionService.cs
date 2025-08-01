namespace FormBuilderApi.Services
{
    public interface IAesEncryptionService
    {
        string Decrypt(string cipherText);
        string Encrypt(string plainText);
    }
}