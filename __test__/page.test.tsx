import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LandingPage from "../src/app/(site)/page";

describe("LandingPage", () => {
  test("renders a button => Get InfinityNote Free ", () => {
    render(<LandingPage />);
    const button = screen.getByRole("button", { name: "Get InfinityNote Free" });
    expect(button).toBeInTheDocument();
  });
  test("render TitleSection with correct test", () => {
    render(<LandingPage />);
    const titleElement = screen.getByText(
      "All-In-One Collaboration and Productivity Platform"
    );
    const pillElement = screen.getByText("✨ Your Workspace, Perfected");
    expect(titleElement).toBeInTheDocument();
    expect(pillElement).toBeInTheDocument();
  });
  test("renders CustomCard with the correct content", () => {
    const testimonial = {
      name: "David",
      message:
        "I was skeptical at first, but Cypress exceeded my expectations. Our project timelines have improved, and collaboration between teams is seamless.",
    };

    render(<LandingPage />);

    const davidElements = screen.getAllByText("David");
    const messageElements = screen.getAllByText(testimonial.message);
    const avatarElements = screen.getAllByText("AV");
    expect(davidElements[0]).toBeInTheDocument();
    expect(messageElements[0]).toBeInTheDocument();
    expect(avatarElements[0]).toBeInTheDocument(); // Check for AvatarFallback content
  });
});
