const { SpecForge } = require('./src/index');
const forge = new SpecForge({
  name: { type: 'string', required: true, default: 'Untitled' },
  port: { type: 'number', default: 3000, validate: v => v > 0 && v < 65536 },
  mode: { type: 'string', default: 'production', enum: ['development', 'production', 'test'] },
  features: { type: 'array', default: [] },
  debug: { type: 'boolean', default: false },
});
console.log('Default:', forge.getDefaults());
console.log('Built:', forge.build({ name: 'MyApp', port: '8080', mode: 'development', debug: 'true' }));
console.log('Validate:', forge.validate({ port: 99999 }));
