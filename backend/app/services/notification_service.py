from typing import List, Dict, Any, Optional
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from loguru import logger


class NotificationService:
    """Service for sending notifications via various channels"""
    
    def __init__(self):
        self.smtp_server = getattr(settings, "SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = getattr(settings, "SMTP_PORT", 587)
        self.smtp_username = getattr(settings, "SMTP_USERNAME", "")
        self.smtp_password = getattr(settings, "SMTP_PASSWORD", "")
        self.from_email = getattr(settings, "FROM_EMAIL", "noreply@competitiveintel.com")
        
    def send_alert(self, recipient: str, subject: str, content: str, priority: str = "medium") -> bool:
        """Send alert notification via email"""
        try:
            if not self.smtp_username or not self.smtp_password:
                logger.warning("SMTP credentials not configured, skipping email notification")
                return False
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = f"[{priority.upper()}] {subject}"
            message["From"] = self.from_email
            message["To"] = recipient
            
            # Create HTML content
            html_content = f"""
            <html>
                <body>
                    <h2>{subject}</h2>
                    <p><strong>Priority:</strong> {priority}</p>
                    <p><strong>Time:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
                    <hr>
                    <p>{content}</p>
                    <hr>
                    <p><em>This is an automated message from Competitive Intelligence System</em></p>
                </body>
            </html>
            """
            
            # Attach HTML content
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(message)
            
            logger.info(f"Alert sent to {recipient}: {subject}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send alert to {recipient}: {str(e)}")
            return False
    
    def send_daily_report(self, recipient: str, report_data: Dict[str, Any]) -> bool:
        """Send daily intelligence report"""
        try:
            subject = f"Daily Intelligence Report - {datetime.utcnow().strftime('%Y-%m-%d')}"
            
            # Create HTML report
            html_content = f"""
            <html>
                <body>
                    <h1>Daily Intelligence Report</h1>
                    <p><strong>Date:</strong> {datetime.utcnow().strftime('%Y-%m-%d')}</p>
                    <p><strong>Generated:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
                    
                    <h2>Summary</h2>
                    <ul>
                        <li>Total Insights: {report_data.get('total_insights', 0)}</li>
                        <li>Unread Insights: {report_data.get('unread_insights', 0)}</li>
                        <li>Recent (24h): {report_data.get('recent_insights', 0)}</li>
                        <li>High Priority: {report_data.get('high_priority_insights', 0)}</li>
                    </ul>
                    
                    <h2>By Category</h2>
                    <ul>
            """
            
            for category, count in report_data.get('by_category', {}).items():
                html_content += f"<li>{category}: {count}</li>"
            
            html_content += """
                    </ul>
                    
                    <h2>High Priority Insights</h2>
            """
            
            high_priority = report_data.get('high_priority_insights', [])
            if high_priority:
                for insight in high_priority[:10]:  # Limit to top 10
                    html_content += f"""
                    <div style="margin: 10px 0; padding: 10px; border-left: 3px solid #dc2626; background-color: #fef2f2;">
                        <h3>{insight.get('title', 'Untitled')}</h3>
                        <p>{insight.get('summary', '')}</p>
                        <p><small>Category: {insight.get('category', 'N/A')} | Discovered: {insight.get('discovered_at', 'N/A')}</small></p>
                    </div>
                    """
            else:
                html_content += "<p>No high priority insights today.</p>"
            
            html_content += """
                    <hr>
                    <p><em>This is an automated daily report from Competitive Intelligence System</em></p>
                </body>
            </html>
            """
            
            return await self.send_alert(recipient, subject, html_content, "low")
            
        except Exception as e:
            logger.error(f"Failed to send daily report: {str(e)}")
            return False
    
    def send_insight_alert(self, recipient: str, insight_data: Dict[str, Any]) -> bool:
        """Send alert for a specific high-priority insight"""
        try:
            subject = f"High Priority Insight: {insight_data.get('title', 'Untitled')}"
            
            content = f"""
            <h3>{insight_data.get('title', 'Untitled')}</h3>
            <p><strong>Priority:</strong> {insight_data.get('priority', 'unknown')}</p>
            <p><strong>Category:</strong> {insight_data.get('category', 'unknown')}</p>
            <p><strong>Relevance:</strong> {insight_data.get('relevance_score', 0):.2%}</p>
            <hr>
            <p>{insight_data.get('summary', '')}</p>
            """
            
            if insight_data.get('source_url'):
                content += f'<p><a href="{insight_data["source_url"]}">View Source</a></p>'
            
            return await self.send_alert(recipient, subject, content, insight_data.get('priority', 'medium'))
            
        except Exception as e:
            logger.error(f"Failed to send insight alert: {str(e)}")
            return False


# Global notification service instance
notification_service = NotificationService()
