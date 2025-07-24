import React from "react";
import { Card, CardContent, CardTitle } from "./ui/card";

export default function PlanCard({ item, onClick }: any) {
  return (
    <Card
      className="w-full cursor-pointer hover:border hover:border-c-primary-purplish-blue"
      onClick={onClick}
    >
      <CardContent className="w-full lg:pt-5 flex items-center h-full gap-[14px] p-4 lg:flex-col lg:items-start">
        <div className="relative w-10 h-10 lg:mb-[39px] bg-gray-200 rounded" />
        <div className="flex flex-col gap-[7px]">
          <CardTitle className="text-base font-medium text-c-primary-marine-blue">
            {item?.name}
          </CardTitle>
        </div>
      </CardContent>
    </Card>
  );
}
