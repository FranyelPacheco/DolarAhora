export default async function handler(req, res) {
    try {
        const r = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
            body: JSON.stringify({ asset: 'USDT', fiat: 'VES', page: 1, rows: 10, tradeType: 'BUY' })
        });
        if (!r.ok) throw new Error(`Binance ${r.status}`);

        const { data } = await r.json();
        const precios = (data || []).map(a => parseFloat(a.adv?.price)).filter(Number.isFinite);
        if (!precios.length) throw new Error('Sin anuncios');

        const precio = precios.reduce((s, p) => s + p, 0) / precios.length;
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        res.status(200).json({ precio });
    } catch (e) {
        res.status(502).json({ error: e.message });
    }
}
