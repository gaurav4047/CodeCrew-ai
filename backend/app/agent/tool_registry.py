from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
import json
from loguru import logger


class ToolResult(BaseModel):
    """Standardized result format for all tools"""
    success: bool
    data: Any
    metadata: Dict[str, Any] = {}
    error: Optional[str] = None
    tool_name: str
    execution_time: float = 0.0


class BaseTool(ABC):
    """Base class for all tools in the agent system"""
    
    def __init__(self):
        self.name = self.__class__.__name__
        self.description = self.get_description()
        self.parameters = self.get_parameters()
        
    @abstractmethod
    def get_description(self) -> str:
        """Return a description of what this tool does"""
        pass
    
    @abstractmethod
    def get_parameters(self) -> Dict[str, Any]:
        """Return the parameters this tool accepts"""
        pass
    
    @abstractmethod
    async def execute(self, **kwargs) -> ToolResult:
        """Execute the tool with given parameters"""
        pass
    
    def validate_parameters(self, params: Dict[str, Any]) -> bool:
        """Validate that required parameters are provided"""
        required_params = self.parameters.get("required", [])
        for param in required_params:
            if param not in params:
                return False
        return True


class ToolRegistry:
    """Registry for managing available tools"""
    
    def __init__(self):
        self.tools: Dict[str, BaseTool] = {}
        
    def register_tool(self, tool: BaseTool):
        """Register a new tool"""
        self.tools[tool.name] = tool
        logger.info(f"Registered tool: {tool.name}")
        
    def get_tool(self, tool_name: str) -> Optional[BaseTool]:
        """Get a tool by name"""
        return self.tools.get(tool_name)
    
    def list_tools(self) -> List[Dict[str, Any]]:
        """List all available tools with their descriptions"""
        return [
            {
                "name": tool.name,
                "description": tool.description,
                "parameters": tool.parameters
            }
            for tool in self.tools.values()
        ]
    
    def get_openai_tool_schemas(self) -> List[Dict[str, Any]]:
        """Get tools in OpenAI/Groq function calling format"""
        schemas = []
        for tool in self.tools.values():
            properties = {}
            required = []
            
            params = tool.parameters
            if isinstance(params, dict):
                # Required params
                if "required" in params and isinstance(params["required"], list):
                    for req in params["required"]:
                        required.append(req)
                        properties[req] = {"type": "string", "description": f"The {req} parameter for {tool.name}"}
                
                # Optional params
                if "optional" in params and isinstance(params["optional"], dict):
                    for k, v in params["optional"].items():
                        properties[k] = {
                            "type": v.get("type", "string") if isinstance(v, dict) else "string",
                            "description": v.get("description", f"{k} parameter") if isinstance(v, dict) else f"{k} parameter"
                        }
            
            schemas.append({
                "type": "function",
                "function": {
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": {
                        "type": "object",
                        "properties": properties,
                        "required": required
                    }
                }
            })
        return schemas

    async def execute_tool(self, tool_name: str, **kwargs) -> ToolResult:
        """Execute a tool by name with arguments"""
        tool = self.get_tool(tool_name)
        if not tool:
            return ToolResult(
                success=False,
                data=None,
                error=f"Tool '{tool_name}' not found in registry",
                tool_name=tool_name,
                execution_time=0.0
            )
        try:
            return await tool.execute(**kwargs)
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {str(e)}")
            return ToolResult(
                success=False,
                data=None,
                error=str(e),
                tool_name=tool_name,
                execution_time=0.0
            )


# Global tool registry instance
tool_registry = ToolRegistry()

