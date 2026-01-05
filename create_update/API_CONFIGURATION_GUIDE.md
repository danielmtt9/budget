# API Configuration Guide for Resume-Matcher

Resume-Matcher requires an LLM (Language Model) and an Embedding Model to function. You have several options for configuring these.

## 🎯 Quick Start

Run the interactive configuration script:

```bash
cd ~/applications/create_update
./configure_api_key.sh
```

The script will guide you through setting up your preferred provider.

## 📋 Provider Options

### Option 1: OpenAI (Cloud-based, Paid)
- **Requires**: OpenAI API key from https://platform.openai.com/api-keys
- **Best for**: Production use, highest quality
- **Cost**: Pay per use
- **Models**: 
  - LLM: gpt-4o-mini, gpt-4, gpt-4o
  - Embedding: text-embedding-3-large, text-embedding-3-small

**Manual Configuration:**
Edit `/home/danielaroko/applications/Resume-Matcher/apps/backend/.env`:
```env
LLM_PROVIDER="openai"
OPENAI_API_KEY="sk-your-api-key-here"
LL_MODEL="gpt-4o-mini"
EMBEDDING_PROVIDER="openai"
EMBEDDING_MODEL="text-embedding-3-large"
```

### Option 2: OpenRouter (Cloud-based, Paid)
- **Requires**: OpenRouter API key from https://openrouter.ai/keys
- **Best for**: Access to many different models from one API
- **Cost**: Pay per use (often cheaper than OpenAI)
- **Models**: meta-llama/llama-3.1-8b-instruct, anthropic/claude-3.5-sonnet, etc.
- **Note**: OpenRouter doesn't provide embeddings, so you'll need a separate embedding provider

**Manual Configuration:**
```bash
# Install OpenRouter support
cd /home/danielaroko/applications/Resume-Matcher/apps/backend
.venv/bin/pip install llama-index-llms-openrouter
```

Edit `/home/danielaroko/applications/Resume-Matcher/apps/backend/.env`:
```env
LLM_PROVIDER="llama_index.llms.openrouter.OpenRouter"
LLM_API_KEY="your-openrouter-key"
LL_MODEL="meta-llama/llama-3.1-8b-instruct"

# For embeddings, use OpenAI or local Ollama
EMBEDDING_PROVIDER="openai"
EMBEDDING_API_KEY="your-openai-key"
EMBEDDING_MODEL="text-embedding-3-large"
```

### Option 3: Local Ollama (Free, Runs Locally)
- **Requires**: Ollama installed locally
- **Best for**: Free usage, privacy, offline capability
- **Cost**: Free (uses your computer's resources)
- **Models**: llama3.1, llama3.2, qwen2.5, bge-m3, etc.
- **Installation**: https://ollama.com/download

**Setup:**
```bash
# Install Ollama (if not already installed)
curl -fsSL https://ollama.com/install.sh | sh

# Pull models
ollama pull llama3.1:latest
ollama pull bge-m3:latest

# Start Ollama (if not running)
ollama serve
```

Edit `/home/danielaroko/applications/Resume-Matcher/apps/backend/.env`:
```env
LLM_PROVIDER="ollama"
LL_MODEL="llama3.1:latest"
EMBEDDING_PROVIDER="ollama"
EMBEDDING_MODEL="bge-m3:latest"
```

### Option 4: Other Providers (Advanced)
Resume-Matcher supports 90+ LLM providers through LlamaIndex. See:
- LLM Providers: https://docs.llamaindex.ai/en/stable/module_guides/models/llms/modules/
- Embedding Providers: https://docs.llamaindex.ai/en/stable/module_guides/models/embeddings/

Examples include:
- Anthropic (Claude)
- Hugging Face
- Cohere
- AI21
- Together AI
- Fireworks AI

## 🔧 Configuration Files

### Backend Configuration
File: `/home/danielaroko/applications/Resume-Matcher/apps/backend/.env`

Key variables:
```env
# LLM Configuration
LLM_PROVIDER="provider_name"          # openai, ollama, or full class name
LLM_API_KEY="your-key"                # API key (if required)
LLM_BASE_URL="url"                    # Base URL (if required)
LL_MODEL="model-name"                 # Model identifier

# Embedding Configuration
EMBEDDING_PROVIDER="provider_name"    # openai, ollama, or full class name
EMBEDDING_API_KEY="your-key"          # API key (if required)
EMBEDDING_BASE_URL="url"              # Base URL (if required)
EMBEDDING_MODEL="model-name"          # Model identifier
```

## 📝 After Configuration

1. **Restart the service** to apply changes:
   ```bash
   cd ~/applications/create_update
   ./manage_services.sh restart
   ```

2. **Check logs** to verify it's working:
   ```bash
   ./manage_services.sh logs
   ```

3. **Access the application**:
   - Frontend: http://YOUR_IP:30001
   - Backend API: http://YOUR_IP:50001

## 🐛 Troubleshooting

### "API key not found" error
- Verify the API key is correctly set in the `.env` file
- Ensure no extra spaces or quotes around the key
- Check that the service was restarted after configuration

### "Model not found" (Ollama)
- Run `ollama list` to see available models
- Pull the model: `ollama pull model-name`
- Ensure Ollama is running: `ollama serve`

### "Connection refused" (Ollama)
- Start Ollama: `ollama serve`
- Check if it's running: `ps aux | grep ollama`

### Service won't start after configuration
- Check logs: `sudo journalctl -u resume-matcher.service -n 50`
- Verify `.env` file syntax (no syntax errors)
- Restore backup if needed: `cp /path/to/.env.backup.TIMESTAMP /path/to/.env`

## 💡 Recommendations

**For Development/Testing:**
- Use local Ollama (free, private)
- Models: llama3.1:latest + bge-m3:latest

**For Production:**
- Use OpenAI (highest quality, most reliable)
- Models: gpt-4o-mini + text-embedding-3-large
- Or OpenRouter for cost savings

**For Privacy:**
- Use local Ollama exclusively
- All processing happens on your machine
- No data sent to external services

## 🔒 Security Notes

- Never commit API keys to version control
- Keep `.env` files secure (they're in .gitignore by default)
- Backup files may contain API keys - handle them carefully
- Use environment-specific keys (dev vs. production)

## 📚 Additional Resources

- Resume-Matcher Configuration: `/home/danielaroko/applications/Resume-Matcher/docs/CONFIGURING.md`
- OpenAI Models: https://platform.openai.com/docs/models
- Ollama Models: https://ollama.com/library
- OpenRouter Models: https://openrouter.ai/models
- LlamaIndex Integrations: https://docs.llamaindex.ai/
