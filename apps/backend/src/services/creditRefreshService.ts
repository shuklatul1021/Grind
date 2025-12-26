import cron from 'node-cron';
import { prisma } from "@repo/db/DatabaseClient";

export const startCreditRefreshCron = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Starting daily credit refresh...');
            const users = await prisma.user.findMany({
                where: {
                    aitoken: {
                        lt: 3
                    }
                },
                select: {
                    id: true,
                    aitoken: true,
                    email: true
                }
            });

            console.log(`Found ${users.length} users to refresh credits`);

            // Update credits for each user
            for (const user of users) {
                const currentCredits = user.aitoken || 0;
                const creditsToAdd = 3 - currentCredits;

                if (creditsToAdd > 0) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            aitoken: 3
                        }
                    });
                    console.log(`Updated ${user.email}: ${currentCredits} → 3 credits (+${creditsToAdd})`);
                }
            }

            console.log('Daily credit refresh completed successfully!');
        } catch (error) {
            console.error('Error during credit refresh:', error);
        }
    }, {
        timezone: "Asia/Kolkata" 
    });

    console.log('Credit refresh cron job scheduled for 12:00 AM IST daily');
};