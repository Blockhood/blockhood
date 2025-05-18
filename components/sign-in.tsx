"use client"

type SignInPromptProps = {
  title: string
  description: string
  buttonText: string
  icon?: string
  onSignInClick: () => void
}

export default function SignInPrompt({
  title,
  description,
  buttonText,
  icon = "fas fa-user-plus",
  onSignInClick,
}: SignInPromptProps) {
  return (
    <div className="submit-guide">
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onSignInClick} className="cta-button cta-primary">
        <i className={icon}></i> {buttonText}
      </button>
    </div>
  )
}
