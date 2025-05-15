import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { LeaderBoardRank } from "../interfaces/leaderboardRank";
import { LeaderboardData } from "../interfaces/leaderboardData";
import { getImage } from "./fileController";

export async function insertLeaderboard(
    vendorId: string
) {
    try {
        const { error } = await supabase
        .from("leaderboard")
        .insert({
            vendor_id: vendorId,
            rank: 0,
            rank_change: 'Neutral'
        })

        if(error){
            throw error
        }

        return true
    } catch (error) {
        console.error("Error inserting leaderboard entry:", error);
        return false;
    }
}

export async function refreshVendorRank() {
    try {
        const { data: vendorData, error } = await supabase
        .from("vendor")
        .select(`
            id,
            vendor_green_score,
            leaderboard:leaderboard(
            rank
            )
        `);

        if(error){
            console.error("Error fetching vendor + leaderboard", error)
            return;
        }

        const sortedVendors: LeaderBoardRank[] = vendorData
        .map((v: any) => ({
            id: v.id,
            vendor_green_score: v.vendor_green_score,
            current_rank: v.leaderboard?.rank,
        }))
        .sort((a, b) => b.vendor_green_score - a.vendor_green_score);

        for (let i = 0; i < sortedVendors.length; i++) {
            const vendor = sortedVendors[i];
            const newRank = i + 1;
            let rankChange: "Up" | "Down" | "Neutral" = "Neutral";
            
            if (vendor.current_rank !== undefined) {
                if (newRank < vendor.current_rank) rankChange = "Up";
                else if (newRank > vendor.current_rank) rankChange = "Down";
            }

        //  Upsert leaderboard entry
            //console.log(`Current vendor: ${vendor.id}, rank change: ${vendor.current_rank}, rank status: ${rankChange}`)
            const { error: upsertError } = await supabase
            .from("leaderboard")
            .upsert(
                {
                    vendor_id: vendor.id,
                    rank: newRank,
                    rank_change: rankChange,
                },
                { onConflict: "vendor_id" } // Use vendor_id to determine if insert or update
            );
            
            if (upsertError) {
                console.error(`Failed to update leaderboard for vendor ${vendor.id}:`, upsertError);
            }
  }
    } catch (error) {
        console.error("Error inserting leaderboard entry:", error);
    }
}

export async function fetchLeaderboard(

) {
    try {
        const { data, error } = await supabase
        .from("leaderboard")
        .select(`
            vendor_id,
            rank,
            rank_change,
            vendor (
                vendor_name,
                vendor_image_name,
                vendor_green_score
            )
        `)
        .order("rank", { ascending: true });

        //console.log(`Leaderboard data: ${JSON.stringify(data)}`)
        if (error) {
            console.error("Error fetching leaderboard:", error.message);
            return;
        }

        if (!data) return [];

        const leaderboard: LeaderboardData[] = await Promise.all(
            data.map(async (entry: any) => {
                const imageUrl = await getImage(entry.vendor.vendor_image_name);
                return {
                    vendor_id: entry.vendor_id,
                    rank: entry.rank,
                    rank_change: entry.rank_change,
                    vendor_name: entry.vendor.vendor_name,
                    imageUrl,
                    vendor_green_score: entry.vendor.vendor_green_score
                };
            })
        );

        //console.log(`Returned leaderboard data: ${JSON.stringify(leaderboard)}`)
        return leaderboard;
    } catch (error) {
        console.error("Unexpected error:", error);
        return null;
    }
}