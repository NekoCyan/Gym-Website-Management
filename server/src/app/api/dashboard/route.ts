import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
    await dbConnect();

	
}