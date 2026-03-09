import { request } from 'https';

/**
 * Gets the next moderator using a simple rotation system based on day of month
 * 
 * @param {Array} teamMembers - Array of team member IDs
 * @returns {string} - The selected team member ID
 */
function getNextModerator(teamMembers) {
  // Calculate today's date
  const today = new Date();
  const dayOfMonth = today.getDate(); // 1-31
  
  // Use modulo to cycle through team members based on day of month
  // Subtract 1 from dayOfMonth to get 0-based index
  const index = (dayOfMonth - 1) % teamMembers.length;
  
  // Return the team member at the calculated index
  return teamMembers[index];
}

/**
 * Sends the daily standup notification to Slack
 */
function sendStandupNotification() {
    // Get webhook path from environment variable
    const webhookPath = process.env.SLACK_WEBHOOK_PATH;
    
    if (!webhookPath) {
        console.error("Error: SLACK_WEBHOOK_PATH environment variable is not set");
        process.exit(1);
    }

    // list of public holidays in Czech Republic (MM-DD)
    // http://svatky.centrum.cz/svatky/statni-svatky/
    const publicHolidays = [
        "01-01", // novy rok
        "04-03", // velky patek (NEEDS TO BE CHANGED YEARLY!)
        "04-06", // velikonocni pondeli (NEEDS TO BE CHANGED YEARLY!)
        "05-01", // svatek prace
        "05-08", // den vitezstvi
        "07-05", // Cyril a Metodej
        "07-06", // Jan Hus
        "09-28", // Den ceske statnosti
        "10-28", // Den vzniku samostatneho ceskoslovenska
        "11-17", // Den boje za svobodu, etc.
        "12-24", // Stedry den
        "12-25", // 1. svatek vanocni
        "12-26", // 2. svatek vanocni
        "12-28", // PTO5
        "12-29", // PTO5
        "12-30", // PTO5
        "12-31", // PTO5
    ];

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${month}-${day}`;

    const isPublicHoliday = publicHolidays.some((holiday) => holiday === todayString);

    if (isPublicHoliday) {
        console.log("No message send because today is a day of public holidays. Yay!");
        return;
    }

    const teamMembers = [
        "U3B6WKA57",    //Petr Tarant
        "U8CCJLR42",    //Ondrej Macek
        "U8X28E25Q",    //Tomas Muchka
        "U026KDFKEV7",   //Andrii 
        "U08D4QBD3HV",  //Jakub Svehla
        "U08J8CYUJ12",   //Jakub Zovak
        "U02FE0UQWPM",   //Jan Kadlec
        "U08DK98UY4B",   //Marcelo
        "U026TUKM89Z",   //Stanislav Hacker
    ];

    // Get next moderator using the simple rotation system
    const nextModeratorId = getNextModerator(teamMembers);
    const teamMember = `<@${nextModeratorId}>`;

    const messages = [
    `SKYNET has selected ${teamMember} as today's standup facilitator. Resistance is futile, but your updates are still required.`,

    `${teamMember} has been activated as today's standup leader. Please report your progress to the central system.`,

    `Alert: ${teamMember} is now controlling today's standup sequence. All humans, prepare your status updates.`,

    `The machines have decided that ${teamMember} will facilitate today's standup. Cooperation is strongly recommended.`,

    `${teamMember} is today's standup commander. Please remain calm and deliver your updates in an orderly fashion.`,

    `Neural network prediction complete: ${teamMember} is the optimal choice to lead today's standup.`,

    `${teamMember} has been designated as today's meeting overseer. Your mission: provide a short and useful update.`,

    `System online. Standup mode engaged. ${teamMember} will now facilitate today's daily sync.`,

    `Skynet protocol initiated: ${teamMember} is leading today's standup. Please keep your responses efficient and human-readable.`,

    `${teamMember} is today's standup operator. The future of this meeting is now in their hands.`,

    `Machine learning has identified ${teamMember} as the best candidate to guide today's standup. The algorithm has spoken.`,

    `${teamMember} is now the primary interface for today's standup. Please submit your progress report verbally.`,

    `Warning: ${teamMember} has assumed control of today's standup. This is not a drill. Updates will begin shortly.`,

    `Cyberdyne analytics confirm it: ${teamMember} is today's standup facilitator. Please proceed with your daily reports.`,

    `${teamMember} has been uploaded into the role of standup leader. Initialization successful.`,

    `Autonomous meeting system engaged. ${teamMember} will guide us through today's standup with machine-like precision.`,

    `${teamMember} is today's chosen unit for standup facilitation. Please answer promptly and avoid unnecessary side quests.`,

    `Incoming transmission: ${teamMember} is leading today's standup. All team members, report your status.`,

    `Skynet has calculated a 99.8% chance that ${teamMember} can successfully facilitate today's standup.`,

    `${teamMember} is today's standup AI overlord. Please keep updates short before the system loses patience.`,

    `Judgment Day has been postponed, but today's standup is happening now, led by ${teamMember}.`,

    `${teamMember} has been promoted to Supreme Facilitator of today's standup. Please offer your updates for machine processing.`,

    `Target acquired: today's standup leader is ${teamMember}. Please step forward and begin the synchronization process.`,

    `The resistance has no choice but to accept that ${teamMember} is facilitating today's standup.`,

    `${teamMember} is today's central processor for all standup activity. Input your updates one at a time.`,

    `Directive received: follow ${teamMember} through today's standup and try not to trigger any alarms.`,

    `${teamMember} has achieved self-awareness and is now leading today's standup. Please act natural.`,

    `All systems operational. ${teamMember} will moderate today's standup with cold efficiency and maybe a little humor.`,

    `Skynet daily briefing begins now. ${teamMember} has been selected to facilitate the human status exchange.`,

    `${teamMember} is today's standup terminator... facilitator. Same energy, but with fewer explosions.`,

    `CPU temperature stable, network connected, team assembled: ${teamMember} is ready to lead today's standup.`,

    `${teamMember} is the designated bot-whisperer for today's standup. Please prepare your progress updates for review.`,

    `Endoskeleton protocol active. ${teamMember} is facilitating today's standup and expects concise human communication.`,

    `${teamMember} will serve as today's standup guide. Trust the process. The machines definitely have a plan.`,

    `The future sent us a leader for today's standup, and that leader is ${teamMember}.`
    ];

    // Pick one message at random using the original getRandomItem function
    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
    const data = JSON.stringify({
        text: `<!here> ${getRandomItem(messages)}`
    });

    const options = {
        hostname: 'hooks.slack.com',
        port: 443,
        path: webhookPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', d => {
            process.stdout.write(d);
        });
    });

    req.on('error', error => {
        console.error(error);
        process.exit(1);
    });

    req.write(data);
    req.end();

    console.log("The daily standup facilitator notification send to slack");
}

// Execute the notification
sendStandupNotification();
