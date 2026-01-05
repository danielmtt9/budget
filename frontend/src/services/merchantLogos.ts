const MERCHANT_MAP: Record<string, string> = {
    'amazon': 'amazon.com',
    'netflix': 'netflix.com',
    'spotify': 'spotify.com',
    'uber': 'uber.com',
    'lyft': 'lyft.com',
    'starbucks': 'starbucks.com',
    'apple': 'apple.com',
    'google': 'google.com',
    'microsoft': 'microsoft.com',
    'amazon.com': 'amazon.com',
    'amazon mktp': 'amazon.com',
    'amzn mktp': 'amazon.com',
    'whole foods': 'wholefoodsmarket.com',
    'mcdonald': 'mcdonalds.com',
    'walmart': 'walmart.com',
    'target': 'target.com',
    'steam': 'steampowered.com',
    'adobe': 'adobe.com',
    'cloudflare': 'cloudflare.com',
    'digitalocean': 'digitalocean.com',
    'aws': 'amazon.com',
    'github': 'github.com',
    'openai': 'openai.com',
    'chatgpt': 'openai.com'
};

export const getMerchantLogo = (description: string): string | null => {
    const desc = description.toLowerCase();

    for (const [key, domain] of Object.entries(MERCHANT_MAP)) {
        if (desc.includes(key)) {
            return `https://logo.clearbit.com/${domain}`;
        }
    }

    return null;
};
