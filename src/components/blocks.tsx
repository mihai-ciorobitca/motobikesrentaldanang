import { imageSize } from "@/lib/server-data";
import Image from "next/image";
import type { Block } from "@/lib/data";

/** Renders scraped content blocks (headings, paragraphs, list items, images) as clean HTML */
export function Blocks({ blocks, alt = "" }: { blocks: Block[]; alt?: string }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (key: number) => {
    if (list.length) {
      out.push(
        <ul key={`ul-${key}`}>
          {list.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  blocks.forEach((b, i) => {
    if (b.t === "li") {
      list.push(b.v);
      return;
    }
    flush(i);
    if (b.t === "h") out.push(<h2 key={i}>{b.v}</h2>);
    else if (b.t === "p") out.push(<p key={i}>{b.v}</p>);
    else if (b.t === "img") {
      const s = imageSize(b.v);
      out.push(
        <Image key={i} src={b.v} alt={alt} width={s.width} height={s.height} sizes="(min-width: 768px) 720px, 100vw" className="my-6 h-auto w-full rounded-2xl" />,
      );
    }
  });
  flush(blocks.length);
  return <div className="prose-content">{out}</div>;
}
