import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface Entry {
  t: string;
  tool: string;
  cid?: string;
}

/**
 * Lê o usage.log do volume e agrega métricas de uso — sem banco de dados.
 * Tudo em memória, por requisição (volume baixo de um projeto de fã).
 */
@Injectable()
export class StatsService {
  private readonly file = process.env.USAGE_LOG_DIR
    ? path.join(process.env.USAGE_LOG_DIR, 'usage.log')
    : '';

  compute() {
    const entries: Entry[] = [];
    try {
      if (this.file && fs.existsSync(this.file)) {
        for (const line of fs.readFileSync(this.file, 'utf8').split('\n')) {
          if (!line.trim()) continue;
          try {
            const e = JSON.parse(line) as Entry;
            if (e && e.t) entries.push(e);
          } catch {
            /* linha corrompida — ignora */
          }
        }
      }
    } catch {
      /* arquivo indisponível — retorna zeros */
    }

    const byDay = new Map<string, { calls: number; cids: Set<string> }>();
    const byTool = new Map<string, number>();
    const allCids = new Set<string>();

    for (const e of entries) {
      const day = String(e.t).slice(0, 10);
      if (!byDay.has(day)) byDay.set(day, { calls: 0, cids: new Set() });
      const d = byDay.get(day)!;
      d.calls++;
      const tool = e.tool || 'unknown';
      byTool.set(tool, (byTool.get(tool) || 0) + 1);
      if (e.cid) {
        d.cids.add(e.cid);
        allCids.add(e.cid);
      }
    }

    const days = [...byDay.entries()]
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([day, v]) => ({ day, calls: v.calls, people: v.cids.size }));
    const tools = [...byTool.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tool, calls]) => ({ tool, calls }));

    const today = days.length
      ? days[days.length - 1]
      : { day: '-', calls: 0, people: 0 };
    const recent = entries.slice(-40).reverse();

    return {
      totalCalls: entries.length,
      totalPeople: allCids.size,
      todayCalls: today.calls,
      todayPeople: today.people,
      days,
      tools,
      recent,
      generatedAt: new Date().toLocaleString('sv-SE', {
        timeZone: 'America/Sao_Paulo',
      }),
    };
  }
}
