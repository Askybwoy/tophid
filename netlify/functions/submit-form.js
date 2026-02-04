exports.handler = async (event, context) => {
    // Only allow POST method
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        // Parse form data from request body
        const formData = JSON.parse(event.body);

        // n8n webhook URL
        const webhookUrl = 'https://askydesign.app.n8n.cloud/webhook-test/8ce95c12-10e4-4970-9115-6266b62b8744';

        // Forward data to n8n webhook
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                truck: formData.truck,
                issue: formData.issue,
                phone: formData.phone,
                timestamp: new Date().toISOString(),
                source: 'tophid-truck-landing'
            })
        });

        // Check if webhook received the data successfully
        if (!response.ok) {
            throw new Error(`Webhook responded with status: ${response.status}`);
        }

        const result = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: true,
                message: 'Заявка успешно отправлена!'
            })
        };

    } catch (error) {
        console.error('Error sending to webhook:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: false,
                error: 'Ошибка отправки заявки. Пожалуйста, попробуйте позже или позвоните нам.'
            })
        };
    }
};
