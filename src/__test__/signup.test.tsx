import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "../pages/signup";

describe("Signup UI Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
  });

  it("allows typing into all input fields", () => {
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(usernameInput, { target: { value: "JohnDoe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.change(confirmInput, { target: { value: "123456" } });

    expect(usernameInput).toHaveValue("JohnDoe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(passwordInput).toHaveValue("123456");
    expect(confirmInput).toHaveValue("123456");
  });

});
