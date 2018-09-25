import fetch from 'node-fetch'
import * as packet from 'dns-packet'
import * as qs from 'querystring'

const DNS_FORMAT = 'application/dns-udpwireformat'

export default async function lookup(name: string, url: string): Promise<string[]> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': DNS_FORMAT,
      'Accept': DNS_FORMAT,
    },
    body: packet.encode({
      type: 'query',
      id: 0,
      flags: packet.RECURSION_DESIRED,
      questions: [{
        type: 'A',
        class: 'IN',
        name: qs.escape(name)
      }],
    })
  })
  const answers = packet.decode(await response.buffer()).answers
  return answers.map(answer => answer.data as string)
}
