import * as fs from 'fs'
import * as path from 'path'

type HostData = Record<string, string[]>
export const HOST_PATH = path.join(process.env.SYSTEMROOT, 'System32/drivers/etc/hosts')

export class Hosts {
  private data: HostData = {}

  getHost(serverName: string): string {
    if (serverName in this.data) {
      return this.data[serverName].find(name => /^[\d.]+$/.test(name)) || serverName
    } else {
      return serverName
    }
  }

  load(filepath: string = HOST_PATH): this {
    const text = fs.readFileSync(filepath).toString()
    text.match(/^\d.+$/gm).forEach((line) => {
      const match = line.match(/(\S+)\s+(\S+)/)
      if (match) this.data[match[2]] = [match[1]]
    })
    return this
  }
}
