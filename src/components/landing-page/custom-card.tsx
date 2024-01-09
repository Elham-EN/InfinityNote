import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { cn } from "@/lib/utils";

/**
 * extracts the prop types from the Card component. This means CardProps
 * will have the same type as the props expected by Card.
 */
type CardProps = React.ComponentProps<typeof Card>;

/**
 * It combines (&) the props of Card (from CardProps) with additional
 * properties: cardHeader, cardContent, and cardFooter.
 */
type CustomCardProps = CardProps & {
  cardHeader?: React.ReactNode;
  cardContent?: React.ReactNode;
  cardFooter?: React.ReactNode;
};

export default function CustomCard({
  className,
  cardHeader,
  cardContent,
  cardFooter,
  ...props
}: CustomCardProps): React.ReactElement {
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>{cardHeader}</CardHeader>
      <CardContent className="grid gap-4">{cardContent}</CardContent>
      <CardFooter>{cardFooter}</CardFooter>
    </Card>
  );
}
