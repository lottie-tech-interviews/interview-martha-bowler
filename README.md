## Quick start

### Prerequisites
- **Node.js**: v24 or newer
- **pnpm**: v10.14 or newer

You can install these using `asdf` or a similar tool that uses `.tool-versions`.
Otherwise you can install the latest PNPM version with this command: `curl -fsSL https://get.pnpm.io/install.sh | sh -`

### Install dependencies
```bash
pnpm install
```

Note: old version of pnpm can lead to the following error:
```
ERROR: packages field missing or empty
```
Update with the above command.

### Run in development
```bash
pnpm dev
```
- Server starts at `http://localhost:3210`
- **Swagger UI** at `http://localhost:3210/docs`

Set a custom port if needed:
```bash
PORT=4000 pnpm dev
```
