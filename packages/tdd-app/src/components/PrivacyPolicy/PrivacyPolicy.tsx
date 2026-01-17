import {
  Box,
  Container,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

function PrivacyPolicy() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Card sx={{ borderRadius: 3, mt: 10 }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h4" fontWeight={600}>
                Privacy Policy
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Last updated: January 2026
              </Typography>

              <Typography variant="body1">
                This application is a client-side developer utility toolbox. It
                does not collect, store, or transmit any personal data. We
                respect your privacy and have designed this app to work entirely
                in your browser.
              </Typography>

              <Typography variant="h6" fontWeight={600}>
                What data we collect
              </Typography>
              <Typography variant="body1">
                We do <strong>not</strong> collect any personal information.
                Specifically, we do <strong>not</strong> collect:
              </Typography>
              <ul>
                <li>Names or email addresses</li>
                <li>IP addresses</li>
                <li>Usage analytics</li>
                <li>Tracking identifiers</li>
                <li>Cookies or local storage for tracking</li>
                <li>Authentication data</li>
                <li>Uploaded content</li>
              </ul>
              <Typography variant="body1">
                All tools run locally in your browser.
              </Typography>

              <Typography variant="h6" fontWeight={600}>
                How your data is used
              </Typography>
              <Typography variant="body1">
                Any data you enter into the tools (such as JWTs, Base64 text, QR
                content, etc.) is processed locally in your browser only. Your
                data is never sent to a server, logged, stored remotely, or
                shared with third parties. Closing the page clears all data.
              </Typography>

              <Typography variant="h6" fontWeight={600}>
                Cookies
              </Typography>
              <Typography variant="body1">
                This app does not use cookies or tracking technologies.
              </Typography>

              <Typography variant="h6" fontWeight={600}>
                Third-party services
              </Typography>
              <Typography variant="body1">
                This app does not integrate with any third-party analytics,
                advertising, or tracking services. It does not embed external
                content that tracks users.
              </Typography>

              <Typography variant="h6" fontWeight={600}>
                Data security
              </Typography>
              <Typography variant="body1">
                Since no data is transmitted or stored, there is no risk of
                server-side data exposure. You remain fully in control of any
                information you enter.
              </Typography>

              <Typography variant="h6" fontWeight={600}>
                Your rights
              </Typography>
              <Typography variant="body1">
                Because no personal data is collected or processed, there is no
                personal data to access, correct, or delete.
              </Typography>

              <Typography variant="h6" fontWeight={600}>
                Changes to this policy
              </Typography>
              <Typography variant="body1">
                This policy may be updated if the app functionality changes. Any
                updates will be reflected on this page.
              </Typography>

              <Typography variant="h6" fontWeight={600}>
                Contact
              </Typography>
              <Typography variant="body1">
                If you have any questions about this privacy policy, you can
                contact the app maintainer via the project repository.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default PrivacyPolicy;
