export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  pokemonService: {
    apiKey: process.env.POKEMEON_KEY,
    host: process.env.POSTGRES_HOST || 'localhost',
    port: +process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '123456789',
    database: process.env.POSTGRES_DB || 'tododb',
  },
});
