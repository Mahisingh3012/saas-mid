import { cn, getSubjectColor } from "@/lib/utils";





//import MyIcon from "../icons/test.svg";
import Link from "next/link";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Companion = {
  id?: string;         // made optional to support items without id
  subject: string;
  name: string;
  topic: string;
  duration: number;
  color?: string;
};

interface CompanionsListProps {
  title: string;
  companions: Companion[];
  classNames?: string;
  // optional: choose dedupe strategy: 'id' | 'name' | 'content'
  dedupeBy?: "id" | "name" | "content";
}

const dedupeCompanions = (items: Companion[], strategy: CompanionsListProps["dedupeBy"] = "content") => {
  const seen = new Set<string>();
  return items.filter((item) => {
    // build a key depending on strategy
    let key: string;
    if (strategy === "id" && item.id) {
      key = `id:${item.id}`;
    } else if (strategy === "name") {
      key = `name:${(item.name || "").toLowerCase().trim()}`;
    } else {
      // content: fallback to id if present, otherwise composite of name|subject|topic
      if (item.id) {
        key = `id:${item.id}`;
      } else {
        key = `content:${(item.name || "").toLowerCase().trim()}|${(item.subject || "").toLowerCase().trim()}|${(item.topic || "").toLowerCase().trim()}`;
      }
    }

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const CompanionsList: React.FC<CompanionsListProps> = ({ title, companions, classNames, dedupeBy = "content" }: CompanionsListProps ) => {
  // remove duplicates using chosen strategy (default: content)
  const uniqueCompanions = dedupeCompanions(companions, dedupeBy);

  // debug: drop a log so you can see counts (server console for server components)
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[CompanionsList] original:", companions.length, "unique:", uniqueCompanions.length, uniqueCompanions.map(c => c.id ?? c.name));
  }

  return (
   <article className={cn('companion-list', classNames)}>

      <h2 className="font-bold text-3xl">{title ?? "Recent Sessions"}</h2>

      <Table>
        <TableCaption>A list of your recent sessions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3">Lessons</TableHead>
            <TableHead className="text-lg">Subject</TableHead>
            <TableHead className="text-lg text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uniqueCompanions.map(({id, subject, name, topic, duration}) => (
            <TableRow  key={id ?? `${name}-${subject}-${topic}`}>
              <TableCell>
                <Link href={`/companions/${id ?? ""}`}>
                <div className="flex items-center gap-2">
                  <div className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden" style={{backgroundColor:getSubjectColor(subject)}}>
                    <Image src={`/icons/${subject}.svg`} alt={subject} width={35} height={35}/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-bold text-2xl">{name}</p>
                    <p className="text-lg">{topic}</p>
                  </div>
                </div>
                </Link>
              </TableCell>
              <TableCell>
                <div className="subject-badge w-fit" >
                  {subject}
                </div>
                <div className="flex items-center justify-center rounded-lg w-fit p-2 " style={{backgroundColor:getSubjectColor(subject)}}>
                  <Image
                     src={`/icons/${subject}.svg`}
                     alt={subject}
                     width={18}
                     height={18}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 w-full">
                  <p className="text-2xl ">
                    {duration} {' '}
                    <span className="max-md:hidden">
                    mins
                    </span>
                  </p>
                    <Image src="/icons/clock.svg" alt="minutes" width={14} height={14} className="md:hidden"/>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  )
}

export default CompanionsList
