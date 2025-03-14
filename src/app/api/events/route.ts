import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database/dbConnect";
import Event from "@/lib/models/Event";
import { getUserID } from "@/lib/helper";

export async function GET(req: NextRequest) {
    await dbConnect();
    const user = await getUserID(req);

    if (user.error) {
        return NextResponse.json({ success: false, error: user.error }, { status: user.status });
    }

    try {
        // Alle Events abrufen, bei denen der Nutzer entweder Ersteller oder Mitglied ist
        const events = (await Event.find({
            $or: [{ creator: user.id }, { members: user.id }]
        })
            .populate("creator", "vorname name benutzername _id")
            .populate("members", "vorname name benutzername _id")
            .populate("groups", "groupname beschreibung members")
            .select("title start end description location allday creator members groups")
            .lean()) || [];

        if (!events || events.length === 0) {
            return NextResponse.json({ success: false, error: "Keine Events gefunden." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: events }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {
    await dbConnect();
    const user = await getUserID(req);

    // Überprüfen, ob der Nutzer authentifiziert ist
    if (user.error) {
        return NextResponse.json({ success: false, error: user.error }, { status: user.status });
    }

    try {
        // Body der Anfrage auslesen
        const { title, start, end, description, location, groups, members, allday } = await req.json();

        // Pflichtfelder validieren
        if (!title || !start) {
            return NextResponse.json({ success: false, error: "Title und Start-Datum sind erforderlich." }, { status: 400 });
        }

        // Neues Event erstellen
        const newEvent = new Event({
            creator: user.id,  // Ersteller ist der eingeloggte Benutzer
            members,
            title,
            start,
            end: allday ? undefined : end, // Falls `allDay`, dann kein `end`
            description,
            location,
            groups,
            allday,
        });

        // Event speichern
        const savedEvent = await newEvent.save();

        return NextResponse.json({ success: true, data: savedEvent }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: `Fehler beim Erstellen des Events: ${error.message}` }, { status: 500 });
    }
}