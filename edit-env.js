// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
const [args] = process.argv.slice(2);


(() => {
  const file = fs.readFileSync('.env', 'utf8');

  const env = file.toString().replace(/\r/g, '');
  const envLines = env.split('\n').filter((line) => line.length > 0)

  const prodIndex = envLines.findIndex((line) => line.includes('PROD'))
  const testIndex = envLines.findIndex((line) => line.includes('DEV'))

  const keysIsProd = !envLines[prodIndex + 1].startsWith('#') && envLines[testIndex + 1].startsWith('#')

  if (args === 'prod' && !keysIsProd) {
    updateFile(envLines)
    console.log(`\x1b[31m${'KEYS are production'}\x1b[0m`)
    return
  }

  if (args === 'dev' && keysIsProd) {
    updateFile(envLines)
    console.log(`\x1b[36m${'KEYS are dev'}\x1b[0m`)
    return
  }

  console.log(`\x1b[32m${'KEYS are ok'}\x1b[0m`)
})()

function updateFile(envLines) {
  const notEnv = ['PROD', 'DEV']
  const newEnv = envLines.map(((line, index) => {
    if (notEnv.some((env) => line.includes(env))) {
      if (index === 0) {
        return line
      }
      return `\n${line}`
    }

    if (line.startsWith('#')) {
      return line.replace('#', '').trim()
    } else {
      return `# ${line}`
    }
  })).join('\n')

  fs.writeFile('.env', newEnv, (err) => {
    if (err) throw err;
  });
}
