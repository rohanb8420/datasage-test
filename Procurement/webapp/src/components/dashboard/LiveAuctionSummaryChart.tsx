import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AuctionData {
  auction_id: string;
  item: string;
  num_bids: number;
  leading_bidder: string;
}

const LiveAuctionSummaryChart: React.FC = () => {
  const [data, setData] = useState<AuctionData[]>([]);

  useEffect(() => {
    Papa.parse("/data/live_auction_summary.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        setData(results.data as AuctionData[]);
      }
    });
  }, []);

  const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload as AuctionData;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p><strong>{d.auction_id} ({d.item})</strong></p>
          <p>Bids: {d.num_bids}</p>
          <p>Leading: {d.leading_bidder}</p>
        </div>
      );
    }
    return null;
  };

  return (
      <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid stroke="currentColor" strokeDasharray="3 3" strokeOpacity={0.1} />
        <XAxis dataKey="auction_id" stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} />
        <YAxis stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="num_bids" fill="#8884d8" name="Bids" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LiveAuctionSummaryChart;