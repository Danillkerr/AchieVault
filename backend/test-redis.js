const Redis = require('ioredis');

async function testConnection() {
  console.log('🔌 Попытка подключения к Redis...');
  console.log(`HOST: ${process.env.REDIS_HOST}`);
  console.log(`PORT: ${process.env.REDIS_PORT}`);

  const redis = new Redis({
    host: 'suited-owl-15006.upstash.io',
    port: '6379',
    password: 'ATqeAAIncDJjNGYxMWQyZjRiZDU0MmNhODVhOGFlODdlNmYwYzZjM3AyMTUwMDY',
    tls: {},
    maxRetriesPerRequest: null,
  });

  try {
    // 1. Проверка связи
    console.log('📡 Отправляем PING...');
    const pingRes = await redis.ping();
    console.log(`✅ Ответ от Redis: ${pingRes}`);

    // 2. Проверка записи
    console.log('📝 Пробуем записать данные...');
    await redis.set('test-key', 'Hello from Node.js!');

    // 3. Проверка чтения
    const value = await redis.get('test-key');
    console.log(`📖 Прочитали данные: ${value}`);

    if (value === 'Hello from Node.js!') {
      console.log('🎉 УРА! Redis работает и доступен!');
    } else {
      console.error('❌ Данные не совпали!');
    }
  } catch (error) {
    console.error('❌ ОШИБКА ПОДКЛЮЧЕНИЯ:', error);
  } finally {
    redis.disconnect();
  }
}

testConnection();
