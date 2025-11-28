/**
 * Smoke test using the built-in Fetch API in Node 20+.
 */

async function main(): Promise<void> {
  const url = "http://localhost:3000/run";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      provider: "openai",
      input: "Smoke test input",
      profileId: "default"
    })
  });

  const json = await response.json();
  console.log("Smoke test response:");
  console.log(JSON.stringify(json, null, 2));
}

main().catch((err) => {
  console.error("Smoke test failed:", err);
});
