export interface Subject { id:string; name:string; category:string; description:string; active:boolean; color:'amber'|'sage'|'sky'|'navy'; goal?:{targetLessons:number;label:string;example:boolean} }
export type ContentBlock = {type:'paragraph'|'heading'|'exercise';text:string}|{type:'code';text:string;language:string}|{type:'list';items:string[]};
export interface Lesson { id:string;subjectId:string;date:string;title:string;summary:string;status:'published'|'draft';example:boolean;tags:string[];content:ContentBlock[];source:{kind:'manual'|'scheduled-task'|'example';label:string} }
export interface Journal {subjects:Subject[];lessons:Lesson[];issues:string[]}
export function isRecord(value:unknown):value is Record<string,unknown>;
export function validDate(value:unknown):value is string;
export function validateSubject(value:unknown):Subject;
export function validateLesson(value:unknown,subjectIds:string[],today?:string):Lesson;
export function validateCollection(subjects:unknown,lessons:unknown,options?:{strict?:boolean;today?:string}):Journal;
