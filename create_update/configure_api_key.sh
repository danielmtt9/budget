#!/bin/bash

# API Key Configuration Helper for Resume-Matcher
# This script helps configure LLM and embedding providers for Resume-Matcher

set -e

BACKEND_ENV="/home/danielaroko/applications/Resume-Matcher/apps/backend/.env"

echo "🔑 Resume-Matcher API Configuration Helper"
echo "=========================================="
echo ""
echo "This script will help you configure the LLM provider for Resume-Matcher."
echo ""
echo "Select your provider:"
echo "1) OpenAI (requires OpenAI API key)"
echo "2) OpenRouter (requires OpenRouter API key)"
echo "3) Local Ollama (no API key needed, runs locally)"
echo "4) Other LlamaIndex provider (advanced)"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "📝 Configuring OpenAI..."
        read -p "Enter your OpenAI API key: " api_key
        read -p "Enter LLM model (e.g., gpt-4o-mini, gpt-4): " llm_model
        read -p "Enter embedding model (e.g., text-embedding-3-large): " embed_model
        
        # Backup existing .env
        cp "$BACKEND_ENV" "${BACKEND_ENV}.backup.$(date +%s)"
        
        # Update .env file
        sed -i 's/^LLM_PROVIDER=.*/LLM_PROVIDER="openai"/' "$BACKEND_ENV"
        
        # Add or update API key
        if grep -q "^OPENAI_API_KEY=" "$BACKEND_ENV"; then
            sed -i "s|^OPENAI_API_KEY=.*|OPENAI_API_KEY=\"$api_key\"|" "$BACKEND_ENV"
        else
            echo "OPENAI_API_KEY=\"$api_key\"" >> "$BACKEND_ENV"
        fi
        
        sed -i "s/^LL_MODEL=.*/LL_MODEL=\"$llm_model\"/" "$BACKEND_ENV"
        sed -i 's/^EMBEDDING_PROVIDER=.*/EMBEDDING_PROVIDER="openai"/' "$BACKEND_ENV"
        sed -i "s/^EMBEDDING_MODEL=.*/EMBEDDING_MODEL=\"$embed_model\"/" "$BACKEND_ENV"
        
        echo "✅ OpenAI configured successfully!"
        ;;
        
    2)
        echo ""
        echo "📝 Configuring OpenRouter..."
        read -p "Enter your OpenRouter API key: " api_key
        read -p "Enter LLM model (e.g., meta-llama/llama-3.1-8b-instruct): " llm_model
        
        # Backup existing .env
        cp "$BACKEND_ENV" "${BACKEND_ENV}.backup.$(date +%s)"
        
        # Install OpenRouter provider
        echo "📦 Installing OpenRouter provider..."
        cd /home/danielaroko/applications/Resume-Matcher/apps/backend
        .venv/bin/pip install llama-index-llms-openrouter
        
        # Update .env file
        sed -i 's|^LLM_PROVIDER=.*|LLM_PROVIDER="llama_index.llms.openrouter.OpenRouter"|' "$BACKEND_ENV"
        
        if grep -q "^LLM_API_KEY=" "$BACKEND_ENV"; then
            sed -i "s|^LLM_API_KEY=.*|LLM_API_KEY=\"$api_key\"|" "$BACKEND_ENV"
        else
            echo "LLM_API_KEY=\"$api_key\"" >> "$BACKEND_ENV"
        fi
        
        sed -i "s/^LL_MODEL=.*/LL_MODEL=\"$llm_model\"/" "$BACKEND_ENV"
        
        # For embedding, suggest using OpenAI or local Ollama
        echo ""
        echo "⚠️  OpenRouter doesn't provide embedding models."
        echo "Choose an embedding provider:"
        echo "1) OpenAI (requires API key)"
        echo "2) Local Ollama (free, runs locally)"
        read -p "Enter choice [1-2]: " embed_choice
        
        case $embed_choice in
            1)
                read -p "Enter OpenAI API key: " openai_key
                read -p "Enter embedding model (e.g., text-embedding-3-large): " embed_model
                sed -i 's/^EMBEDDING_PROVIDER=.*/EMBEDDING_PROVIDER="openai"/' "$BACKEND_ENV"
                
                if grep -q "^EMBEDDING_API_KEY=" "$BACKEND_ENV"; then
                    sed -i "s|^EMBEDDING_API_KEY=.*|EMBEDDING_API_KEY=\"$openai_key\"|" "$BACKEND_ENV"
                else
                    echo "EMBEDDING_API_KEY=\"$openai_key\"" >> "$BACKEND_ENV"
                fi
                
                sed -i "s/^EMBEDDING_MODEL=.*/EMBEDDING_MODEL=\"$embed_model\"/" "$BACKEND_ENV"
                ;;
            2)
                echo "Using Ollama for embeddings (requires Ollama running locally)"
                sed -i 's/^EMBEDDING_PROVIDER=.*/EMBEDDING_PROVIDER="ollama"/' "$BACKEND_ENV"
                sed -i 's/^EMBEDDING_MODEL=.*/EMBEDDING_MODEL="bge-m3:latest"/' "$BACKEND_ENV"
                echo "⚠️  Make sure to run: ollama pull bge-m3:latest"
                ;;
        esac
        
        echo "✅ OpenRouter configured successfully!"
        ;;
        
    3)
        echo ""
        echo "📝 Configuring Local Ollama..."
        echo "Available Ollama models on your system:"
        ollama list || echo "⚠️  Ollama not running or not installed"
        echo ""
        read -p "Enter LLM model (e.g., llama3.1:latest): " llm_model
        read -p "Enter embedding model (e.g., bge-m3:latest): " embed_model
        
        # Backup existing .env
        cp "$BACKEND_ENV" "${BACKEND_ENV}.backup.$(date +%s)"
        
        # Update .env file
        sed -i 's/^LLM_PROVIDER=.*/LLM_PROVIDER="ollama"/' "$BACKEND_ENV"
        sed -i "s/^LL_MODEL=.*/LL_MODEL=\"$llm_model\"/" "$BACKEND_ENV"
        sed -i 's/^EMBEDDING_PROVIDER=.*/EMBEDDING_PROVIDER="ollama"/' "$BACKEND_ENV"
        sed -i "s/^EMBEDDING_MODEL=.*/EMBEDDING_MODEL=\"$embed_model\"/" "$BACKEND_ENV"
        
        echo ""
        echo "📥 Pull models if not already downloaded:"
        echo "   ollama pull $llm_model"
        echo "   ollama pull $embed_model"
        echo ""
        read -p "Pull models now? [y/N]: " pull_choice
        
        if [[ "$pull_choice" =~ ^[Yy]$ ]]; then
            ollama pull "$llm_model"
            ollama pull "$embed_model"
        fi
        
        echo "✅ Ollama configured successfully!"
        ;;
        
    4)
        echo ""
        echo "📝 Advanced LlamaIndex Provider Configuration"
        echo "See: https://docs.llamaindex.ai/en/stable/module_guides/models/llms/modules/"
        echo ""
        read -p "Enter LLM_PROVIDER (full class name): " llm_provider
        read -p "Enter LLM_API_KEY: " api_key
        read -p "Enter LLM_BASE_URL (if needed, or press Enter): " base_url
        read -p "Enter LL_MODEL: " llm_model
        
        # Backup existing .env
        cp "$BACKEND_ENV" "${BACKEND_ENV}.backup.$(date +%s)"
        
        # Update .env file
        sed -i "s|^LLM_PROVIDER=.*|LLM_PROVIDER=\"$llm_provider\"|" "$BACKEND_ENV"
        
        if grep -q "^LLM_API_KEY=" "$BACKEND_ENV"; then
            sed -i "s|^LLM_API_KEY=.*|LLM_API_KEY=\"$api_key\"|" "$BACKEND_ENV"
        else
            echo "LLM_API_KEY=\"$api_key\"" >> "$BACKEND_ENV"
        fi
        
        if [ -n "$base_url" ]; then
            if grep -q "^LLM_BASE_URL=" "$BACKEND_ENV"; then
                sed -i "s|^LLM_BASE_URL=.*|LLM_BASE_URL=\"$base_url\"|" "$BACKEND_ENV"
            else
                echo "LLM_BASE_URL=\"$base_url\"" >> "$BACKEND_ENV"
            fi
        fi
        
        sed -i "s/^LL_MODEL=.*/LL_MODEL=\"$llm_model\"/" "$BACKEND_ENV"
        
        echo "✅ Custom provider configured!"
        echo "⚠️  Don't forget to configure EMBEDDING_PROVIDER separately"
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📄 Current configuration:"
echo "========================"
grep -E "^(LLM_PROVIDER|LL_MODEL|EMBEDDING_PROVIDER|EMBEDDING_MODEL|LLM_API_KEY|EMBEDDING_API_KEY|OPENAI_API_KEY)=" "$BACKEND_ENV" | sed 's/\(API_KEY=\).*/\1***HIDDEN***/'
echo ""
echo "💾 Backup saved to: ${BACKEND_ENV}.backup.*"
echo ""
echo "🔄 Restart the service to apply changes:"
echo "   cd ~/applications/create_update"
echo "   ./manage_services.sh restart"
echo ""
